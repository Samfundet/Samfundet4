/**
 * Shrimp fishing game
 *
 * Important note: This is a MG::WEB pride project, which implies that.
 * external sources such as AI assistants, libraries, and frameworks are not allowed.
 * CoPilot is allowed, however only as completion, not by instruction, this includes comments in code.
 *
 * The original Shrimp Fishing game was created by @evgiz in V22, on Samf3
 * This version is a continuation of the original game, by @Mathias-a in H24, on Samf4
 */
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { FriedShrimpIcon } from './FriedShrimpIcon';
import { SharkIcon } from './SharkIcon';
import styles from './ShrimpFishing.module.scss';
import { ShrimpIcon } from './ShrimpIcon';

const SHRIMP_COUNT = 5;
const FRIED_SHRIMP_COUNT = 2;

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function limitToRange(value: number, min: number, max: number) {
  if (min < value && value < max) {
    return value;
  }
  if (value < min) {
    return min;
  }
  return max;
}

function randomNewPosition(position: [number, number], range: number) {
  const angle = Math.random() * 2 * Math.PI;
  const newX = limitToRange(position[0] + Math.cos(angle) * range, -150, 150);
  const newY = limitToRange(position[1] + Math.sin(angle) * range, 0, 100);
  return [newX, newY];
}

export function ShrimpFishing() {
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [shrimpSpeed, setShrimpSpeed] = useState<number>(3);
  const [sharkSpeed, setSharkSpeed] = useState(3);
  const [shrimps, setShrimps] = useState<MovingItemProps[]>();
  const [friedShrimps, setFriedShrimps] = useState<MovingItemProps[]>();
  const [shrimpCount, setShrimpCount] = useState(SHRIMP_COUNT + FRIED_SHRIMP_COUNT);

  function generateShrimps() {
    const shrimps = Array.from({ length: SHRIMP_COUNT }, (_, index) => ({
      id: `shrimp-${index}`,
      speed: shrimpSpeed,
      onClick: () => {
        setScore((oldScore) => oldScore + 1);
        setShrimpCount((oldShrimpCount) => oldShrimpCount - 1);
        setShrimps((oldShrimps) => oldShrimps?.filter((shrimp) => shrimp.id !== `shrimp-${index}`));
      },
    }));
    setShrimps(shrimps);
  }

  function generateFriedShrimps() {
    const friedShrimps = Array.from({ length: FRIED_SHRIMP_COUNT }, (_, index) => ({
      id: `fried-${index}`,
      speed: shrimpSpeed,
      onClick: () => {
        setScore((oldScore) => oldScore + 5);
        setShrimpCount((oldShrimpCount) => oldShrimpCount - 1);
        setFriedShrimps((oldFriedShrimps) => oldFriedShrimps?.filter((shrimp) => shrimp.id !== `fried-${index}`));
      },
      eaten: () => {
        setShrimpCount((oldShrimpCount) => oldShrimpCount - 1);
        setFriedShrimps((oldFriedShrimps) => oldFriedShrimps?.filter((shrimp) => shrimp.id !== `fried-${index}`));
      },
    }));
    setFriedShrimps(friedShrimps);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: these functions change on every rerender, must not be used as dep
  useEffect(() => {
    generateShrimps();
    generateFriedShrimps();
  }, []);

  useEffect(() => {
    if (shrimpCount === 0) {
      setShowGameOver(true);
    }
  }, [shrimpCount]);

  const gameplay = !showGameOver && (
    <>
      {friedShrimps?.map((shrimp) => (
        <FriedShrimpButton key={shrimp.id} id={shrimp.id} speed={shrimp.speed} onClick={shrimp.onClick} />
      ))}

      {shrimps?.map((shrimp) => (
        <ShrimpButton
          key={shrimp.id}
          id={shrimp.id}
          speed={shrimp.speed}
          onClick={shrimp.onClick}
          eaten={shrimp.onClick}
        />
      ))}

      <SharkButton id={'shark-1'} speed={sharkSpeed} onClick={() => setShowGameOver(true)} />
    </>
  );

  return (
    <div className={styles.container}>
      <div className={styles.offset_container}>
        {gameplay}
        <h1 className={styles.score_text}>Score: {score}</h1>
        <h1 className={styles.game_over_text}>{showGameOver && 'Game Over'}</h1>
      </div>
    </div>
  );
}

type MovingItemProps = {
  id: string;
  speed: number;
  onClick?: () => void;
  sharkPosition?: [number, number];
  eaten?: () => void;
  setSharkPosition?: (position: [number, number]) => void;
};

export function ShrimpButton({ speed, onClick, eaten, sharkPosition }: MovingItemProps) {
  const shrimpRef = useRef<HTMLButtonElement>(null);
  const startingPositionX = Math.random() * 100;
  const startingPositionY = Math.random() * 100;

  // Move shrimp
  useEffect(() => {
    const interval = setInterval(() => {
      if (shrimpRef.current) {
        const deltaPositionY = randomIntFromInterval(-10, 10);
        const newPositionY = limitToRange(Number.parseFloat(shrimpRef.current.style.top) + deltaPositionY, 0, 100);
        shrimpRef.current.style.transitionDuration = `${speed}s`;
        shrimpRef.current.style.top = `${newPositionY}%`;
      }
    }, speed * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [speed]);

  // Check if shrimp is eaten
  useEffect(() => {
    const yCord = shrimpRef.current?.style.top;
    const xCord = shrimpRef.current?.style.left;
    if (
      eaten &&
      sharkPosition &&
      yCord &&
      xCord &&
      Math.abs(Number.parseFloat(yCord) - sharkPosition[0]) < 10
      // Math.abs(parseFloat(xCord) - sharkPosition[1]) < 10
    ) {
      eaten();
    }
  }, [sharkPosition, eaten]);

  return (
    <button
      ref={shrimpRef}
      className={styles.moving_container}
      style={{
        transitionDuration: `${speed}s`,
        top: `${startingPositionY}%`,
        left: `${startingPositionX}%`,
      }}
      onClick={onClick}
      type="button"
    >
      <ShrimpIcon />
    </button>
  );
}

export function SharkButton({ speed, onClick, setSharkPosition }: MovingItemProps) {
  const sharkRef = useRef<HTMLButtonElement>(null);
  const startingPositionX = Math.random() * 100;
  const startingPositionY = Math.random() * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      if (sharkRef.current) {
        const [newPositionX, newPositionY] = randomNewPosition(
          [Number.parseFloat(sharkRef.current.style.left), Number.parseFloat(sharkRef.current.style.top)],
          10,
        );
        sharkRef.current.style.transitionDuration = `${speed}s`;
        sharkRef.current.style.left = `${newPositionX}%`;
        sharkRef.current.style.top = `${newPositionY}%`;
        setSharkPosition?.([newPositionY, newPositionX]);
      }
    }, speed * 3000);

    return () => {
      clearInterval(interval);
    };
  }, [speed, setSharkPosition]);

  return (
    <button
      ref={sharkRef}
      className={classNames(styles.moving_container, styles.shark)}
      style={{
        transitionDuration: `${speed}s`,
        top: `${startingPositionY}%`,
        left: `${startingPositionX}%`,
      }}
      onClick={onClick}
      type="button"
    >
      <SharkIcon />
    </button>
  );
}

export function FriedShrimpButton({ speed, onClick }: MovingItemProps) {
  const friedShrimpRef = useRef<HTMLButtonElement>(null);
  const startingPositionX = Math.random() * 100;
  const startingPositionY = Math.random() * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      if (friedShrimpRef.current) {
        const newPositionY = Math.random() * 100;
        friedShrimpRef.current.style.transitionDuration = `${speed}s`;
        friedShrimpRef.current.style.top = `${newPositionY}%`;
      }
    }, speed * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [speed]);

  return (
    <button
      ref={friedShrimpRef}
      className={styles.moving_container}
      style={{
        transitionDuration: `${speed}s`,
        top: `${startingPositionY}%`,
        left: `${startingPositionX}%`,
      }}
      onClick={onClick}
      type="button"
    >
      <FriedShrimpIcon />
    </button>
  );
}
