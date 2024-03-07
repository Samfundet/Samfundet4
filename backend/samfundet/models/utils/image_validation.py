from PIL import Image
from backend.samfundet.constants import ONE_MB


def is_image_valid(image: Image, max_size: int) -> bool:
    """
    Uses Pillow to verify that the image is an acctauly image.
    Checks if image can be manipulated.
    """
    upper, right, lower, left = 100, 100, 100, 100
    if max_size > 5 * ONE_MB:
        try:
            img = Image.open(image)
            img = img.crop(upper, right, lower, left)
            return True
        except OSError:
            return False
    else:
        return False
