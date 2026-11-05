import type { BaseModelDto } from '~/dto';
import type { TagDto } from '../tags/types';

export type ImageSize = 'original' | 'large' | 'medium' | 'small';

export type ImageDto = BaseModelDto & {
  id: number;
  title: string;
  urls: Record<ImageSize, string>;
  tags: TagDto[];
};

export type ImagePostDto = {
  title: string;
  tag_string: string;
  file: File;
};

export type ImagePatchDto = {
  title?: string;
  tag_string?: string;
  file?: File;
};
