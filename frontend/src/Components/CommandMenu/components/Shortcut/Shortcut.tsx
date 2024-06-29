type ShortcutProps = {
  keys: string[];
};

/**
 * Returnes a styled group of the keystrokes for a keybinding.
 * Keys must be pressed in order and quickly for the action to happen.
 */
export function Shortcut({ keys }: ShortcutProps) {
  if (!keys) return null;

  return (
    <div className="command-menu__shortcut">
      {keys?.map((item, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
        <kbd key={i}>{item}</kbd>
      ))}
    </div>
  );
}
