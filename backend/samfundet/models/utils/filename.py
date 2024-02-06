import uuid
from typing import Any


def upload_file_recruitment_path(instance: Any, filename: str) -> str:
    username = instance.user.username
    recruitment_position_id = instance.recruitment_position.id
    unique_filename = f"{uuid.uuid4()}-{filename}"
    folder_name = f"uploads/recruitment_admission_files/{username}_files/admission_id_{recruitment_position_id}"
    return f"{folder_name}/{unique_filename}"
