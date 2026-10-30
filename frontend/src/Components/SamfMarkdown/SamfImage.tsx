import { useGetImage } from '~/domain';
import { imageUrl } from '~/utils';

type Props = {
  // Lowercase, since it arrives as an HTML attribute from the remark transform
  imageid?: string;
  alt?: string;
};

/**
 * An `::image{id=...}` directive.
 */
export function SamfImage({ imageid, alt }: Props) {
  const { data: image } = useGetImage(imageid);

  if (!image) {
    return null;
  }

  // TODO: we may want to make image size customizable later through props, but 'large' should be safe enough for now
  return <img src={imageUrl(image, 'large')} alt={alt || image.title} />;
}
