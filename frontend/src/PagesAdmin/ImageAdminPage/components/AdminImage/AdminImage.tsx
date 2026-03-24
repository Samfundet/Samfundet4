import { ImageTile } from '~/Components';
import type { ImageDto } from '~/dto';

type AdminImageProps = {
  image: ImageDto;
  className?: string;
};

export function AdminImage({ image, className }: AdminImageProps) {
  return <ImageTile image={image} className={className} />;
}
