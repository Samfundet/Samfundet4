import {
  type DirectiveLike,
  isImageDirective,
  readImageDirective,
} from '~/Components/MarkdownEditor/plugins/samfImage';

const DIRECTIVE_TYPES = ['textDirective', 'leafDirective', 'containerDirective'];

const MARKERS: Record<string, string> = {
  textDirective: ':',
  leafDirective: '::',
  containerDirective: ':::',
};

// Minimal mdast node shape, to not depend on the remark type packages */
type Node = DirectiveLike & {
  value?: string;
  children?: Node[];
  data?: Record<string, unknown>;
};

/**
 * Renders `::image{id=...}` directives as the `samfimage` element, handled by SamfMarkdown.
 *
 * Any other directive is turned back into the text it was written as. Without that, enabling
 * remark-directive would silently swallow colon sequences in existing content.
 */
export function remarkSamfImage() {
  return (tree: Node): void => walk(tree);
}

function walk(node: Node): void {
  if (!node.children) {
    return;
  }

  for (const child of node.children) {
    if (isImageDirective(child)) {
      const { imageId, alt } = readImageDirective(child);
      child.data = {
        ...child.data,
        hName: 'samfimage',
        hProperties: { imageid: String(imageId), alt },
      };
      continue;
    }

    if (DIRECTIVE_TYPES.includes(child.type) && !child.children?.length) {
      child.type = 'text';
      child.value = stringify(child);
      child.children = undefined;
      continue;
    }

    walk(child);
  }
}

function stringify(node: Node): string {
  const attributes = Object.entries(node.attributes ?? {})
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `${MARKERS[node.type] ?? ''}${node.name}${attributes ? `{${attributes}}` : ''}`;
}
