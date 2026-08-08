import type { DirectiveDescriptor } from '@mdxeditor/editor';
import { SamfImageEditor } from './SamfImageEditor';
import { IMAGE_DIRECTIVE_NAME, isImageDirective } from './directive';

/** Teaches mdxeditor how to render our `::image{id=...}` directive */
export const SamfImageDirectiveDescriptor: DirectiveDescriptor = {
  name: IMAGE_DIRECTIVE_NAME,
  type: 'leafDirective',
  attributes: ['id', 'alt'],
  hasChildren: false,
  testNode: isImageDirective,
  Editor: SamfImageEditor,
};
