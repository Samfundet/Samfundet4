import { useEffect, useState } from 'react';
import { sprut } from '~/assets';

export type CommandMenuProps = {
  openKey?: string;
};

export function CommandSprut({ openKey = 's' }: CommandMenuProps) {
  const [active, setActive] = useState(false);

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const SpawnSprut = () => {
    const size = getRandomInt(300);
    return (
      <div
        style={{ position: 'absolute', top: getRandomInt(window.innerHeight), left: getRandomInt(window.innerWidth) }}
      >
        <img src={sprut} alt="Sprut" width={size} height={size} />
      </div>
    );
  };

  useEffect(() => {
    function down(e: KeyboardEvent) {
      const isCmdKClick = e.key === openKey && (e.metaKey || e.ctrlKey);
      if (isCmdKClick) {
        e.preventDefault();
        setActive((open) => !open);
      }
    }

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [openKey]);

  if (active) {
    return (
      <>
        {[...Array(getRandomInt(30))].map((_, i) => (
          <SpawnSprut key={i} />
        ))}
      </>
    );
  }
  return <></>;
}
