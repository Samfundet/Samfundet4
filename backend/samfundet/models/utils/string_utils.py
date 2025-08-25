from __future__ import annotations

import uuid


def ellipsize(string: str, *, length: int) -> str:
    """Shortens a string to a given length and adds ellipsis if the string is longer than the given length."""
    return string[0:length] + '...' if len(string) > length else string


def upload_to_application_filepath(instance, filename: str) -> str:
    """Generates a filepath based on the attachmen name and application id"""
    if instance.application_id is None:
        raise ValueError('Cannot generate upload path without an application ID.')
    return f'recruitment/application_attachments/{instance.application_id}/{uuid.uuid4()}_{filename}'
