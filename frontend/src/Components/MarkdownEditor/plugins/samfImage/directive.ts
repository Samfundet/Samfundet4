/**
 * We can't use plain Markdown images with our uploaded image's url, since our
 * images may be edited, which causes the url to change. This would quietly
 * result in broken images.
 *
 * Instead, we use a custom directive, which references the image ID. The
 * backend read serializers rewrite this directive to plain Markdown images,
 * see backend/samfundet/markdown.py
 *
 * Example use:
 *
 *   ::image{id=42}
 *   ::image{#42}
 *   ::image{#43 alt="Edgar"}
 *
 */
export const IMAGE_DIRECTIVE_NAME = 'image';

export type DirectiveLike = {
  type: string;
  name: string;
  attributes?: Record<string, string | null | undefined> | null;
};

export type ImageDirectiveAttributes = {
  imageId: number;
  alt: string;
};

export function isImageDirective(node: DirectiveLike): boolean {
  return node.type === 'leafDirective' && node.name === IMAGE_DIRECTIVE_NAME;
}

export function readImageDirective(node: DirectiveLike): ImageDirectiveAttributes {
  const id = Number.parseInt(node.attributes?.id ?? '', 10);
  return {
    imageId: Number.isNaN(id) ? Number.NaN : id,
    alt: node.attributes?.alt ?? '',
  };
}

export function writeImageDirective({ imageId, alt }: ImageDirectiveAttributes): Record<string, string> {
  const attributes: Record<string, string> = { id: String(imageId) };
  if (alt.trim()) {
    attributes.alt = alt.trim();
  }
  return attributes;
}
