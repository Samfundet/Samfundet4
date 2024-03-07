from __future__ import annotations

import uuid
import datetime

from backend.root.utils.mixins import CustomBaseModel


def upload_file_recruitment_path(*, instance: CustomBaseModel,
                                 filename: str) -> str:
    recruitment_id = instance.recruitment__id
    unique_filename = f'{uuid.uuid4()}-{filename}'

    # Define the folder name using the username and recruitment_position_id
    folder_name = f'uploads/recruitment_admission_files_{recruitment_id}/'

    # Return the full path to the file
    return f'{folder_name}/{unique_filename}'
