import uuid
from typing import Any


def upload_file_recruitment_path(instance: Any, filename: str) -> str:
    username = instance.user.username
    recruitment_position_id = instance.recruitment_position.id

    timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")  # Formats the current time as YYYYMMDDHHMMSS
    unique_filename = f"{uuid.uuid4()}-{timestamp}-{filename}"

    # Define the folder name using the username and recruitment_position_id
    folder_name = f"uploads/recruitment_admission_files/{username}_files/admission_id_{recruitment_position_id}"

    # Return the full path to the file
    return f"{folder_name}/{unique_filename}"
