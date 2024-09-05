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
/* eslint-disable max-len */
import { useEffect, useRef, useState } from 'react';
import shrimpFishingStyles from './ShrimpFishing.module.scss';

const SHRIMP_COUNT = 3;

export function ShrimpFishing() {
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [shrimpSpeed, setShrimpSpeed] = useState<number>(10);
  const [sharkSpeed, setSharkSpeed] = useState(10);
  const [shrimps, setShrimps] = useState<MovingItemProps[]>();
  const [friedShrimps, setFriedShrimps] = useState<MovingItemProps[]>();

  function generateShrimps() {
    const shrimps = Array.from({ length: SHRIMP_COUNT }, (_, index) => ({
      id: `shrimp-${index}`,
      speed: shrimpSpeed,
      onClick: () => {
        setScore((oldScore) => oldScore + 1);
        setShrimps((oldShrimps) => oldShrimps?.filter((shrimp) => shrimp.id !== `shrimp-${index}`));
      },
    }));
    setShrimps(shrimps);
  }

  function generateFriedShrimps() {
    const friedShrimps = Array.from({ length: SHRIMP_COUNT }, (_, index) => ({
      id: `fried-${index}`,
      speed: shrimpSpeed,
      onClick: () => {
        setScore((oldScore) => oldScore + 5);
        setFriedShrimps((oldFriedShrimps) => oldFriedShrimps?.filter((shrimp) => shrimp.id !== `fried-${index}`));
      },
    }));
    setFriedShrimps(friedShrimps);
  }

  useEffect(() => {
    generateShrimps();
    generateFriedShrimps();
  }, []);

  return (
    <div className={shrimpFishingStyles['container']}>
      {!showGameOver && <>
      <div className={shrimpFishingStyles['offsetContainer']}>
        {friedShrimps?.map((shrimp) => (
          <FriedShrimpButton key={shrimp.id} id={shrimp.id} speed={shrimp.speed} onClick={shrimp.onClick} />
        ))}
        {shrimps?.map((shrimp) => (
          <ShrimpButton key={shrimp.id} id={shrimp.id} speed={shrimp.speed} onClick={shrimp.onClick} />
        ))}
        <SharkButton id={'shark-1'} speed={sharkSpeed} onClick={() => setShowGameOver(true)} />
        </>
      }
        <h1 className={shrimpFishingStyles['scoreText']}>Score: {score}</h1>
        <h1 className={shrimpFishingStyles['gameOverText']}>{showGameOver && 'Game Over'}</h1>
      </div>
    </div>
  );
}

type MovingItemProps = {
  id: string;
  speed: number;
  onClick?: () => void;
};

export function ShrimpButton({ speed, onClick }: MovingItemProps) {
  const shrimpRef = useRef<HTMLButtonElement>(null);
  const startingPositionX = Math.random() * 100;
  const startingPositionY = Math.random() * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      if (shrimpRef.current) {
        const newPositionY = Math.random() * 100;
        shrimpRef.current.style.transitionDuration = `${speed}s`;
        shrimpRef.current.style.top = `${newPositionY}%`;
      }
    }, speed * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [speed]);

  return (
    <button
      ref={shrimpRef}
      className={shrimpFishingStyles['moving-container']}
      style={{
        transitionDuration: `${speed}s`,
        top: `${startingPositionY}%`,
        left: `${startingPositionX}%`,
      }}
      onClick={onClick}
    >
      <ShrimpIcon />
    </button>
  );
}

export function SharkButton({ speed, onClick }: MovingItemProps) {
  const sharkRef = useRef<HTMLButtonElement>(null);
  const startingPositionX = Math.random() * 100;
  const startingPositionY = Math.random() * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      if (sharkRef.current) {
        const newPositionY = Math.random() * 100;
        sharkRef.current.style.transitionDuration = `${speed}s`;
        sharkRef.current.style.top = `${newPositionY}%`;
      }
    }, speed * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [speed]);

  return (
    <button
      ref={sharkRef}
      className={shrimpFishingStyles['moving-container']}
      style={{
        transitionDuration: `${speed}s`,
        top: `${startingPositionY}%`,
        left: `${startingPositionX}%`,
      }}
      onClick={onClick}
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
      className={shrimpFishingStyles['moving-container']}
      style={{
        transitionDuration: `${speed}s`,
        top: `${startingPositionY}%`,
        left: `${startingPositionX}%`,
      }}
      onClick={onClick}
    >
      <FriedShrimpIcon />
    </button>
  );
}

export function FriedShrimpIcon() {
  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      style={{
        height: 'auto',
      }}
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <rect
        width="512"
        height="512"
        x="0"
        y="0"
        rx="30"
        fill="transparent"
        stroke="transparent"
        strokeWidth="0"
        strokeOpacity="100%"
        paintOrder="stroke"
      ></rect>
      <svg
        width="256px"
        height="256px"
        viewBox="0 0 64 64"
        fill="currentColor"
        x="128"
        y="128"
        role="img"
        // style="display:inline-block;vertical-align:middle"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          <path
            fill="#f46c6c"
            d="M27.7 12.2c-3.8 5.2-23.1 9.6-23.1 9.6S7.4 16.4 15 13c0 0-8 3.3-13 1.5c0 0 7.7-8.7 24-10.2l1.7 7.9"
          />
          <path
            fill="#f8d317"
            d="M60.9 27.1c-.7-2.8.6-5.8-1.7-6.9c-1.1-.5-1.8-2.1-2-3.3c-.3-1.3-.1-2.3-1.1-3.2c-1-.9-2.7-1.5-3.7-2.4c-.9-.9-.6-2.2-1.3-3.2c-.9-1.3-2.1-1.7-3.6-1.9c-1.4-.2-2.5-.7-3.6-1.6c-1.1-.9-2.2-1.9-3.7-1.8c-1.2 0-2.4.6-3.6.5c-1.4 0-2.3-1.3-3.7-1.3c-1.1.1-1.9 1.1-2.8 1.5c-1.1.5-2.2-.1-3.4 0c-1.1.1-1.7 1.1-2.2 2c-.7 1.3-1.9 1.4-3 2.3c-.7.5-.9 1.7 0 3.3c.8 1.3.6 3.2 1.7 4.4c1.1 1.2 3.5-.6 4.8.1c1.6.8 2.1 1.7 4 2c1.2.2 2.9 2.7 3.7 3.2c1.2.6 3 1.8 3.7 2.8c.6.9 1.1 3 1.3 4.1c.2 1.3-.6 3.3-1.4 3.9c-1.2.8-2.6 2.3-3.6 3.3c-1.7 1.6-3.7-.3-5.6.3c-1.2.3-2.1 1.2-3.3 1.2c-1.3 0-2.5-.7-3.9-.8c-1.6-.1-3.9 1.6-5 2.5c-1.4 1.2-2.9 1.3-4.5 2c-1.5.7-2 2.1-2.4 3.7c-.4 1.5-2.3 1.6-2.7 2.4c-.9 1.5 1.3 3.5 2.3 6.9c1.2 3.8 1.7 1.6 4.8 3.3c1.2.6 1.9 2.4 3.4 3c1.7.7 3.3-.5 4.9.5c1.1.7 1.6 2.5 3 2.2c1.3-.3 2.5-2.3 3.9-1.8c3.5 1.2 3.3-.5 6.5-.4c1.7 0 3.6 1.7 5.1.3c1.4-1.2 2.3-3.1 4.1-3.3c3.5-.3 3.7-3.1 6.4-4.6c3.6-2.1 4.9-6.2 5.5-8.3c.8-2.8 1.2-5.9 3.3-9.7c1.2-2.5 0-4.8-.6-7.2"
          />
          <path
            fill="#f8b100"
            d="M21.8 42.1c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7c1.3-1.5 1.4-3.7.3-5.2c-.3 1.2-1 2.4-2 3.6m10.5 4.6c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7c1.3-1.5 1.4-3.7.3-5.2c-.4 1.2-1 2.5-2 3.6m-7 8c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7c1.3-1.5 1.4-3.7.3-5.2c-.3 1.2-1 2.5-2 3.6m14.6-1.5c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7c1.3-1.5 1.4-3.7.3-5.2c-.3 1.3-1 2.5-2 3.6m12.7-7.7c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7c1.3-1.5 1.4-3.7.3-5.2c-.3 1.3-1 2.5-2 3.6m-14.6-8c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7s1.4-3.7.3-5.2c-.4 1.2-1.1 2.4-2 3.6m7.5 2.9c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7c1.3-1.5 1.4-3.7.3-5.2c-.4 1.3-1 2.5-2 3.6m3.2-12c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7c1.3-1.5 1.4-3.7.3-5.2c-.4 1.2-1 2.4-2 3.6m-7.4-9.3c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7c1.3-1.5 1.4-3.7.3-5.2c-.4 1.2-1 2.4-2 3.6m9.7-1.6c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7c1.3-1.5 1.4-3.7.3-5.2c-.4 1.2-1 2.5-2 3.6m-9.9-7.4c-1 1.1-2.1 1.9-3.2 2.3c1.5 1.1 3.6.8 4.9-.7c1.3-1.5 1.4-3.7.3-5.2c-.4 1.2-1 2.4-2 3.6m-9.5.3c-1.1 1-2.4 1.6-3.5 1.9c1.4 1.3 3.5 1.3 5 0s1.9-3.5 1-5.1c-.6 1.1-1.4 2.3-2.5 3.2m-16 30.7l-1 1l1 1.1l1-1.1zm.9 7.2l-1 1l1 1l1-1zm13.2-9.1l-1 1l1 1l1.1-1zm10 5.2l-1 1l1 1l1-1zm4.1-10.6l-1 1l1 1l1-1zm10.6-.6l-1.1 1l1.1 1l1-1zm-3.6 6.3l-1 1l1 1l1-1zm-3.6 10.7l-1 1l1 1l1.1-1zm-14.1 3.2l-1 1l1 1l1-1zm-14.5-.7l-1 1l1 1l1-1zm-6.7-4.4l-1 1l1 1l1-1zm46.3-12.1l-1 1l1 1l1-1zM25.1 10.9l-1 1l1 1l1-1zM55 22l-1 1l1 1.1l1.1-1.1zm-9.5 1.8l-1 1l1 1l1-1zM49.3 13l-1 1l1 1l1-1zm-12.6 2.8l-1 1l1 1.1l1-1.1zM39.1 5l-1 1l1 1l1-1zm-9.4.5l-1 1l1 1l1.1-1zm-5.1 40.7l-1 1l1 1l1-1zm31.5-19.1l-1.1 1l1.1 1l1-1zM46.5 8.2l-1 1l1 1l1-1z"
          />
        </g>
      </svg>
    </svg>
  );
}

export function ShrimpIcon() {
  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      style={{
        height: 'auto',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="512"
        height="512"
        x="0"
        y="0"
        rx="30"
        fill="transparent"
        stroke="transparent"
        strokeWidth="0"
        strokeOpacity="100%"
        paintOrder="stroke"
      ></rect>
      <svg
        width="256px"
        height="256px"
        viewBox="0 0 64 64"
        fill="currentColor"
        x="128"
        y="128"
        role="img"
        // style="display:inline-block;vertical-align:middle"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          <path fill="#ed4c5c" d="M37.7 13c-7.3-7.1-17 1.5-29.9-11c8 12.9 22.4 6.5 28.5 12.3l1.4-1.3" />
          <path
            fill="#ff717f"
            d="M48.6 16.5L59 11.1c-15.9 3.7-22.7-.5-25.6 4.4c-7.4-1.2-9.8 3.5-9.8 3.5s-7.6.8-8 6.5c-2.8.3-6.3 2.9-4.9 5.7c-3.4 2-5.9 4.7-3.3 7.3c-3.7 4.3-2.3 6.2-1.4 6.6c-.9 6.6 1.5 7.2 2.3 7.4c.1 2.6.9 6.1 4 9.6c0 0 2.4-2.3.8-5.3c0 0 1.7 2.1 4.2 1.8c0 0 .2-2.3-1.3-5.1c0 0 1.9 1.7 4.2.4c0 0-2.4-3.7-6.6-5.1c.1-1.1-.2-2.5-1-4.2c.8-1.1 1.3-2.7 1.4-5.1c1.3-.9 2.5-2.6 3.3-5.5c1.1-.5 2.4-1.5 3.6-3.2c2.2.3 5.1-.5 8.5-3.5c2.2 0 5-1.1 8.3-4.2c3.5.4 9-.8 17-5.3c-.2.1-1.2.4-6.1-1.3"
          />
          <path
            fill="#fff"
            d="M43.9 15.7c-.8 2.2-3.2 3.4-5.4 2.6c-2.2-.8-3.4-3.2-2.6-5.4c.8-2.2 3.2-3.4 5.4-2.6c2.2.8 3.4 3.2 2.6 5.4"
          />
          <path
            fill="#3e4347"
            d="M41.8 15c-.4 1.1-1.5 1.6-2.6 1.3c-1.1-.4-1.6-1.5-1.3-2.6c.4-1.1 1.5-1.6 2.6-1.3c1.1.4 1.7 1.5 1.3 2.6"
          />
          <g fill="#ed4c5c">
            <path d="M12.3 54.7c.5 2.6.1 7.3.1 7.3c1.9-1.3 1.6-4.2 1.6-4.2c1.4.9 3.4.8 3.4.8c-3.8-1.5-5.1-3.9-5.1-3.9" />
            <path d="M37.1 30c.2-.4.6-.4.1-.9c-1-.9-4.8.6-8.4-1.4c.2-.1.3-.3.5-.4c2.1.1 4.9-.9 8.3-4.3c3.5.4 9-.8 16.9-5.3c-1.1.5-17.6 7.4-21.9-1c-.6 1.8-.2 3.9 1.8 5.2c-6.4 0-17.3-10.7-29.4-5.5c12.5-2.6 19.3 5.5 27 7.4c-2.3 1.1-5.5 1.8-8.5-.5c0 0 1.1 2.3 3.4 3.4c-5.2 3.7-11.5-1.4-11.5-1.4c1 2.5 2.2 4 3.5 4.8c-3.7 4.3-8.4.9-8.4.9c1.7 2 3.2 3 4.6 3.2c-.8 2.2-3.1 6.2-7.9 4.2c0 0 2.3 1.6 4.8 1.5c-.1 1.6-.8 5.5-6.2 5.1c0 0 2.8 1.5 5.1.8c.7 1.6 1.3 4.8-2.8 6.6c0 0 5.1.3 5.6-3.2c1.8 1.2 2.9 2.7 2.9 2.7c-1 .2-3.4-.2-3.4-.2c2.7 2.6 4 6.8 4 6.8c.2-2.7-1.3-5.1-1.3-5.1c2.1 1.8 4.2.4 4.2.4c-2.2-3.2-4.8-4.5-6.4-5c0-1-.3-2.3-1.1-4c.9-1 1.5-2.7 1.4-5.6c1.1-.6 2.1-1.9 2.7-4c.9 1.7 2.8 4.3 6.1 5.7c.3.1.6.3 1-.2c3.2 2.9 2.4 6 3.1 6c.4.4 1 1.3 1.1 3.2c0 0 1.2-2 1-4.2c1 0-1.2-4.4-4.4-6.6c.4-.3.7-.2.5-.8c-.6-1.3-5-1.1-7.5-4.7c1.3-.6 2.3-1.8 3-2.8c.8 1.2 3.5 4.5 8 5.4c.3.1.7.1.9-.4c3.4 2.1 3.7 5.4 4.3 5.3c.4.3 1.2 1.1 1.8 2.9c0 0 .6-2.1.1-4.3c.9-.3-2.2-4-5.7-5.6c.3-.3.7-.3.3-.8c-.8-1.1-4.6-.3-7.8-2.6c1.8-.3 3.5-1.2 4.8-2.2c1.3 1.2 4.4 3.5 8.5 3.5c.3 0 .7 0 .8-.5c4.1 1.7 4.6 4.7 5.3 4.5c.5.2 1.4.8 2.3 2.5c0 0 .3-2.5-.7-4.2c1.1-.3-2.7-3.4-6.4-4.3" />
          </g>
        </g>
      </svg>
    </svg>
  );
}

export function SharkIcon() {
  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      style={{
        height: 'auto',
      }}
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <rect
        width="512"
        height="512"
        x="0"
        y="0"
        rx="30"
        fill="transparent"
        stroke="transparent"
        strokeWidth="0"
        strokeOpacity="100%"
        paintOrder="stroke"
      ></rect>
      <svg
        width="256px"
        height="256px"
        viewBox="0 0 64 64"
        fill="currentColor"
        x="128"
        y="128"
        role="img"
        // style="display:inline-block;vertical-align:middle"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          <path fill="#b2c1c0" d="M44.8 7c-16.1 4.3-20.2 18.5-20.2 18.5L41 28.9C39.6 22.3 44.8 7 44.8 7z" />
          <path fill="#879191" d="m28.5 21.3l13.1-1.8s.2-1.1.4-1.9c-8.8.1-13.5 3.7-13.5 3.7" />
          <path
            fill="#b2c1c0"
            d="M53.1 9.4s3 3 3.8 5.9c4.7 3.2 5.1 7.9 5.1 11c0 10.9-17.2 21.4-17.2 21.4L2 38.5c0-4.3 19.2-19 39-19c6.9 0 16 4.9 18.1 2.6c1.2-1.3-1.3-5.3-2.5-5.3c0 0 .1 2.6-1.2 4.2c.5-5.9-2.3-11.6-2.3-11.6"
          />
          <path fill="#ff717f" d="M19.7 55.2s0-17 16.6-23.8c0 0 9.5 19.2-16.6 23.8" />
          <path fill="#ed4c5c" d="M25.5 38.3S22 48.4 21.9 52.8c0 0 16.5-5.1 12.5-20.6l-8.9 6.1" />
          <path fill="#3e4347" d="M29.6 35.5s-3.5 6-4.1 11.5c-.6 5.5 8.5-2.8 9.3-13.6l-5.2 2.1" opacity=".5" />
          <path
            fill="#fff"
            d="m15.9 48.2l3.3 2.1l-.6-3.9l3 2.2l-.6-4l3.5 2.6l-1.2-4.9l3.8 3.2l-1-5.3l3.9 3.2l-1.3-5.2l3.7 2.6l-1.2-4.8l3.4 3.3l-1.1-5.4s-8.4 5.3-17.6 14.3"
          />
          <path
            fill="#b2c1c0"
            d="m19.2 50.3l-3.3-2.1l1.2-1.1zm-.7-3.9l3 2.2l-2-3.8zm2.4-1.8l3.5 2.6l-2.5-4.5zm2.4-2.3l3.8 3.2l-2.5-4.6zm2.7-2.1l3.9 3.2l-2.8-5zm2.6-2l3.7 2.6l-2.7-4.2zm2.6-2.2l3.4 3.3l-2.3-4.6z"
          />
          <g fill="#fff">
            <path d="m35.4 40.9l-2.2-1l1.3 3.8c.5-1.1.8-2.1.9-2.8m-1.1 3.2l-3.2-1.3l1.4 4c.8-1 1.3-1.9 1.8-2.7m-2.2 3.1l-3.2-1.8l.9 3.9c.8-.7 1.6-1.4 2.3-2.1m-2.7 2.4l-3.3-2.3l.8 3.9c1-.5 1.8-1 2.5-1.6m-2.8 1.9l-3.4-2.6s.5 3.2.6 4c1.1-.4 2-.9 2.8-1.4" />
            <path d="m24 52.9l-3.5-2.8c.2 1.6.7 4 .7 4c1-.4 1.9-.8 2.8-1.2" />
          </g>
          <path
            fill="#b2c1c0"
            d="m35 42.4l-1.9-2.6l1.3 3.8c.3-.3.5-.8.6-1.2m-1.7 3.2l-2.2-2.9l1.4 4c.3-.3.6-.7.8-1.1m-2.5 2.9l-2-3.1l.9 3.9c.4-.2.8-.5 1.1-.8m-2.7 2l-2-3.2l.8 3.9c.5-.2.9-.4 1.2-.7m-3 1.9L23.3 49l.6 4.1c.4-.3.8-.5 1.2-.7m-2.8 1.3l-1.7-3.6l.7 4c.3-.1.6-.3 1-.4m-6.6-5.1s23.6-15.7 21.8-18.3L24 35.7l-8.3 12.9"
          />
          <circle cx="24.7" cy="29.6" r="3.3" fill="#3e4347" />
          <path fill="#76807f" d="M15.9 32.1s4 .8 6-2.5s4.8-3.5 8.6-3.7c0 0-6.1-1.5-9.1.8s-2.8 4.7-5.5 5.4" />
          <path
            fill="#3e4347"
            d="M44 28.6s1.4-.9 1.6-1.9c.3-1.1 1.2-3.2-.1-4.4c0 0 1.8 1 1.1 3.6c-.6 2.5-1.5 2.5-2.6 2.7m1.7.8s1.4-.7 1.8-1.8c.4-1 1.4-3.1.3-4.4c0 0 1.7 1.1.8 3.6c-.9 2.6-1.8 2.5-2.9 2.6m2.2.8s1.4-.8 1.7-1.8c.3-1 1.4-3.1.1-4.4c0 0 1.7 1.1.9 3.6c-.7 2.5-1.6 2.5-2.7 2.6"
            opacity=".5"
          />
          <path fill="#879191" d="M51.3 38.3s3.9-.8 4.8 0l-1.5 1.5l-3.3-1.5" />
          <path fill="#b2c1c0" d="M51.3 38.3C59.8 38.3 62 57 62 57s-8.1-11-18.4-11l7.7-7.7z" />
          <path
            fill="#e8e8e8"
            d="M2 38.5c0-1.1 11.9-3 20.3-.2s10.6-12.4 14.8-11.2c4.6 1.3 1 15.6 10.4 19.4c-8.7 7.8-21.6 12.6-27.7 8.7c23.9-7.9 16.9-22.4 16.9-22.4S26.6 45 15.9 48.7C12 50.1 2 42 2 38.5z"
          />
          <path fill="#3e4347" d="M14.9 39.5s1.6-1 3 0c.6.4-.1 1.3-1.3 1.3c-1.1-.1-.7-1-1.7-1.3" />
        </g>
      </svg>
    </svg>
  );
}
