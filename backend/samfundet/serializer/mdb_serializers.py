from __future__ import annotations

from rest_framework import serializers

from django.core.validators import validate_email


class ConnectToMDBSerializer(serializers.Serializer):
    member_login = serializers.CharField(required=True)
    password = serializers.CharField(required=True, min_length=1)

    def validate_member_login(self, value: str) -> str:
        if not (value.isdigit() or '@' in value):
            raise serializers.ValidationError('Must be a valid email address or numeric member ID')
        if '@' in value:
            try:
                validate_email(value)
            except Exception as e:
                raise serializers.ValidationError('Invalid email address') from e
        return value
