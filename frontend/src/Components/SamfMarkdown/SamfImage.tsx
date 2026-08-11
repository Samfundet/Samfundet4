import { useQuery } from '@tanstack/react-query';
import { getImage } from '~/api';
import { imageKeys } from '~/domain';
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
  const id = Number.parseInt(imageid ?? '', 10);

  const { data: image } = useQuery({
    queryKey: imageKeys.detail(id),
    queryFn: () => getImage(id),
    enabled: !Number.isNaN(id),
  });

  if (!image) {
    return null;
  }

  // TODO: we may want to make image size customizable later through props, but 'large' should be safe enough for now
  return <img src={imageUrl(image, 'large')} alt={alt || image.title} />;
}
