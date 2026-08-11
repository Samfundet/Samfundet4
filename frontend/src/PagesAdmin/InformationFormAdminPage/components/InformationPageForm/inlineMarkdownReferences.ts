// MDXEditor has no import visitors for reference-style markdown (imageReference,
// linkReference, definition), so such documents refuse to load in rich text mode.
// Rewrite them to inline links/images before handing the markdown to the editor.

const DEFINITION = /^[ \t]{0,3}\[([^\]]+)\]:[ \t]*<?([^\s>]+)>?(?:[ \t]+["'(]([^\n]*)["')])?[ \t]*\n?/gm;
const REFERENCE = /(!?)\[([^\]]*)\]\[([^\]]*)\]/g;

type Definition = {
  url: string;
  title?: string;
};

export function inlineMarkdownReferences(markdown: string): string {
  const definitions = new Map<string, Definition>();

  for (const [, label, url, title] of markdown.matchAll(DEFINITION)) {
    definitions.set(label.trim().toLowerCase(), { url, title });
  }

  if (definitions.size === 0) {
    return markdown;
  }

  const inlined = markdown.replace(REFERENCE, (match, bang: string, text: string, label: string) => {
    // Collapsed reference (`[foo][]`) uses the text as its label
    const definition = definitions.get((label || text).trim().toLowerCase());
    if (!definition) {
      return match;
    }
    const title = definition.title ? ` "${definition.title.trim()}"` : '';
    return `${bang}[${text}](${definition.url}${title})`;
  });

  // Any remaining shortcut references degrade to plain text, which the editor accepts
  return inlined.replace(DEFINITION, '');
}
