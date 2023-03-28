import { ImageDto } from '~/dto';

export function imageQuery(images: ImageDto[], search: string): ImageDto[] {
  const searchString = search.toLowerCase();
  const isEmptySearch = searchString.length === 0;

  return images.filter((image) => {
    const titleContainsSearch = image.title.toLowerCase().includes(searchString);

    /** Merge all (lowercased) tags separated with space and search the accumulated string. */
    const tagsContainSearchString = image.tags
      .reduce((accumulator, currentValue) => accumulator + ' ' + currentValue.name.toLowerCase(), '')
      .includes(searchString);

    const keepThisImage = isEmptySearch || titleContainsSearch || tagsContainSearchString;
    return keepThisImage;
  });
}
