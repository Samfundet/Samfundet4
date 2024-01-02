from __future__ import annotations
import sys
import copy
import logging
from typing import Any, Union

from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import DEFERRED, Model

from rest_framework import serializers

LOG = logging.getLogger(__name__)


class FieldTrackerMixin(Model):
    """
    Mixin to cache specific fields when fetching from database.
    Attributes are prefixed with `ftm_` to mitigate name collisions.

    Optimised way of chaching the loaded values of db-fields after fetched model-instances are changed in Python.

    To enable this mixin, one must set the attribute `ftm_track_fields`.
    `ftm_track_fields` is a list of strings which specifies the names of relevant fields.

    Example usage:
    ```python
    class Person(FieldTrackerMixin, models.Model):
        age = models.IntegerField()

        ftm_track_fields = ['age']
        # or
        ftm_track_fields = '__all__' to track all fields.

        def save(self, *args, **kwargs):
            # List of fields this mixin is tracking.
            tracked_fields = gself.ftm_get_tracked_fields()
            # Get access to original values of fields (even if they have changed).
            loaded_values = gself.ftm_get_loaded_fields()
            # Get dirty fields.
            dirty_fields_old, dirty_fields_new = self.ftm_get_dirty_fields()
    ```
    """

    _FTM_TRACK_FIELDS_NAME = 'ftm_track_fields'  # Not private because developer should set this manually.
    _FTM_LOADED_FIELDS_NAME = '_ftm_loaded_fields'

    _FTM_FIELD_BLACKLIST = ['password']

    # Resources:
    # https://stackoverflow.com/a/64116052/12616507
    # https://docs.djangoproject.com/en/4.1/ref/models/instances/#customizing-model-loading

    class Meta:
        abstract = True

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        if not hasattr(self, self._FTM_TRACK_FIELDS_NAME):
            raise Exception(f"Missing field '{self._FTM_TRACK_FIELDS_NAME}' : list[str]'")

        # Shorthand select all fields.
        if self.ftm_get_tracked_fields() == '__all__':
            # Fetch field_names from meta.
            track_fields = [field.attname for field in self._meta.fields if field.attname not in self._FTM_FIELD_BLACKLIST]
            setattr(self, self._FTM_TRACK_FIELDS_NAME, track_fields)  # noqa: FKA01

    @staticmethod
    def ftm_log_parse(*, fields: dict) -> dict:
        """
        Preprocesses fieldsets before logging.
        Need to limit large output. E.g. logo changes generates a large log.
        """
        # Deep copy to not mutate original.
        fields_copy = copy.deepcopy(fields)

        for field, item in fields_copy.items():
            try:
                if sys.getsizeof(str(item)) > 1000:
                    fields_copy[field] = 'Too large to display'
            except TypeError:
                fields_copy[field] = "Omitted, FieldTrackerMixin couldn't determine size."
        return fields_copy

    def ftm_get_tracked_fields(self) -> Union[list[str], str]:
        """Returns a list of all field names this mixin tracks."""
        # ftm_track_fields can be '__all__'.
        return getattr(self, self._FTM_TRACK_FIELDS_NAME, [])  # noqa: FKA01

    def ftm_get_loaded_fields(self) -> dict:
        """Returns the cached tracked values currently on the instance."""
        return getattr(self, self._FTM_LOADED_FIELDS_NAME, {})  # noqa: FKA01

    def ftm_get_dirty_fields(self) -> tuple[dict, dict]:
        """Detects all changes, return old and new states."""
        if not self.pk:
            return {}, {}  # No dirty fields on creation.

        # Get tracked and loaded fields.
        track_fields = self.ftm_get_tracked_fields()
        loaded_fields: dict = self.ftm_get_loaded_fields()

        # Loop tracked field and keep fields that have changed.
        dirty_fields_old = {}
        dirty_fields_new = {}
        for field in track_fields:
            current_value = getattr(self, field)
            loaded_value = loaded_fields.get(field)
            if current_value != loaded_value:
                dirty_fields_old[field] = loaded_value
                dirty_fields_new[field] = current_value

        return dirty_fields_old, dirty_fields_new

    def save(self, *args: Any, **kwargs: Any) -> None:
        """Extends django 'save' to log all changes."""

        # Ensure changes are logged when attempting to save.
        try:
            is_creation = self.pk is None  # Store value before saving because id exists afterwards.
            super().save(*args, **kwargs)

            # Get all changes.
            dirty_fields_old, dirty_fields_new = self.ftm_get_dirty_fields()  # includes id after save.

            # Update loaded_fields after save.
            loaded_fields = self.ftm_get_loaded_fields()
            loaded_fields.update(dirty_fields_new)
            setattr(self, self._FTM_LOADED_FIELDS_NAME, loaded_fields)  # noqa: FKA01

            # Log creation or update.
            if is_creation:  # Log creation.
                LOG.info(f'{self} was created:\n\nfields: {dirty_fields_new}')
                LOG.info(f'{self} was created:\n\nfields: {self.ftm_log_parse(fields=dirty_fields_new)}')
            elif not dirty_fields_new:  # Log save, notify no detection of new fields.
                LOG.info(f"{self} was saved.\nFieldTrackerMixin couldn't detect any changes to tracked fields.")
            else:  # Log changes.
                LOG.info(f'{self} has changed:\n\nold: {dirty_fields_old}\n\n new:{dirty_fields_new}')
                LOG.info(
                    f'{self} has changed:\n\n'
                    f'old: {self.ftm_log_parse(fields=dirty_fields_old)}\n\n'
                    f'new:{self.ftm_log_parse(fields=dirty_fields_new)}'
                )
        except Exception as e:
            # Get all changes.
            dirty_fields_old, dirty_fields_new = self.ftm_get_dirty_fields()
            LOG.info(f'{self} failed attempting to save:\n\nold: {dirty_fields_old}\n\nnew: {dirty_fields_new}')
            LOG.info(
                f'{self} failed attempting to save:\n\n'
                f'old: {self.ftm_log_parse(fields=dirty_fields_old)}\n\n'
                f'new: {self.ftm_log_parse(fields=dirty_fields_new)}'
            )
            raise e

    @classmethod
    def from_db(cls, db, field_names, values):  # type: ignore # noqa: ANN001,ANN206 # Unknown types.
        """Extends django 'from_db' to set 'loaded_fields'."""

        instance = super().from_db(db, field_names, values)  # noqa: FKA01

        track_fields: list[str] = instance.ftm_get_tracked_fields()

        loaded_fields = {field: value for field, value in zip(field_names, values) if field in track_fields and value is not DEFERRED}

        # Set loaded_fields on instance.
        setattr(instance, instance._FTM_LOADED_FIELDS_NAME, loaded_fields)  # noqa: FKA01

        return instance


class FullCleanSaveMixin(Model):
    """Mixin to call full_clean() before save()."""

    class Meta:
        abstract = True

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.full_clean()
        super().save(*args, **kwargs)


class CustomBaseSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField(method_name='get_created_by', read_only=True)
    updated_by = serializers.SerializerMethodField(method_name='get_updated_by', read_only=True)
    """
        Base serializer, sets version fields to read_only
        Adds validation errors from models clean
        Context of request needs to be passed
    """

    class Meta:
        read_only_fields = (
            'version',
            'created_at',
            'created_by',
            'updated_at',
            'updated_by',
        )

    def get_created_by(self, obj: CustomBaseModel):
        return obj.created_by.__str__() if obj.created_by else None

    def get_updated_by(self, obj: CustomBaseModel):
        return obj.updated_by.__str__() if obj.updated_by else None

    def validate(self, attrs: dict) -> dict:
        instance: FullCleanSaveMixin = self.Meta.model(**attrs)
        try:
            instance.full_clean()
        except ValidationError as e:
            raise serializers.ValidationError(e.args[0])
        return attrs

    def create(self, validated_data: dict) -> CustomBaseModel:
        instance = self.Meta.model(**validated_data)
        instance.save(user=self.context['request'].user)
        return instance


class CustomBaseModel(FullCleanSaveMixin):
    """
        Basic model which will contains necessary version info of a model: 
        With by who and when it was updated and created.
        Also keeps a counter for how many times it has been updated
    """
    version = models.PositiveIntegerField(
        default=0,
        null=True,
        blank=True,
        editable=False,
    )

    created_by = models.ForeignKey(
        'User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        editable=False,
        related_name='created',
    )
    created_at = models.DateTimeField(
        null=True,
        blank=True,
        auto_now_add=True,
        editable=False,
    )

    updated_by = models.ForeignKey(
        'User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        editable=False,
        related_name='updated',
    )
    updated_at = models.DateTimeField(
        null=True,
        blank=True,
        auto_now=True,
        editable=False,
    )

    class Meta:
        abstract = True

    def is_edited(self) -> bool:
        """
            Method for checking if object is updated or not
        """
        return self.updated_at != self.created_at

    def save(self, *args: Any, **kwargs: Any) -> None:
        """
            User should always be provided, but that can be ignored. 
            Will update and set which user interacted with it when it was saved.
        """
        self.full_clean()
        self.version += 1
        user = kwargs.pop('user', None)  # Must pop because super().save() doesn't accept user
        if user:
            self.updated_by = user
            if self.created_by is None:
                self.created_by = user
        super().save(*args, **kwargs)
