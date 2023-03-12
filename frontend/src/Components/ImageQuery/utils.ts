import { ImageDto } from '~/dto';

export function imageQuery(images: ImageDto[], search: string): ImageDto[] {
  search = search.toLowerCase();
  return images.filter(
    (image) =>
      search.length == 0 ||
      image.title.toLowerCase().includes(search) ||
      image.tags
        .reduce((accumulator, currentValue) => accumulator + +' ' + currentValue.name.toLowerCase(), '')
        .includes(search),
  );
}
