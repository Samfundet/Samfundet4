import classNames from 'classnames';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import { backgroundImageFromUrl } from '~/utils';
import styles from './Block.module.scss';

// Container

type BlockContainerProps = PropsWithChildren & HTMLAttributes<HTMLDivElement>;

export function BlockContainer({ className, ...props }: BlockContainerProps) {
  return <div className={classNames(styles.container, className)} {...props} />;
}

// Title

type BlockTitleProps = PropsWithChildren & HTMLAttributes<HTMLDivElement>;

export function BlockTitle({ className, ...props }: BlockTitleProps) {
  return <div className={classNames(styles.title, className)} {...props} />;
}

// Block

export type BlockTheme = 'red' | 'purple' | 'green' | 'blue' | 'gold' | 'white';

const blockThemeClassMap: Record<BlockTheme, string> = {
  red: styles.red,
  purple: styles.purple,
  green: styles.green,
  blue: styles.blue,
  gold: styles.gold,
  white: styles.white,
};

type BlockProps = {
  theme?: BlockTheme;
  square?: boolean;
} & PropsWithChildren &
  HTMLAttributes<HTMLDivElement>;

export function Block({ className, theme, square = true, ...props }: BlockProps) {
  return <div
    className={classNames(styles.block, blockThemeClassMap[theme ?? 'red'], { [styles.square]: square }, className)} {...props} />;
}

// Content

type BlockContentProps = PropsWithChildren & HTMLAttributes<HTMLDivElement>;

export function BlockContent({ className, ...props }: BlockContentProps) {
  return <div className={classNames(styles.content, className)} {...props} />;
}

// Header

type BlockHeaderProps = {
  gradient?: boolean;
} & PropsWithChildren &
  HTMLAttributes<HTMLDivElement>;

export function BlockHeader({ className, gradient, ...props }: BlockHeaderProps) {
  return (
    <div>
      <div className={classNames(styles.header, styles.inner_content, className)} {...props} />
      {gradient && <div className={styles.header_gradient} />}
    </div>
  );
}

// Footer

type BlockFooterProps = {
  gradient?: boolean;
} & PropsWithChildren &
  HTMLAttributes<HTMLDivElement>;

export function BlockFooter({ className, gradient, children, ...props }: BlockFooterProps) {
  return (
    <div>
      <div className={styles.footer}>
        <div className={classNames(styles.inner_content, className)} {...props}>
          {children}
        </div>
      </div>
      {gradient && <div className={styles.footer_gradient} />}
    </div>
  );
}

// Image

type BlockImageProps = {
  src: string;
  disableZoomEffect?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export function BlockImage({ className, src, disableZoomEffect, ...props }: BlockImageProps) {
  return (
    <div className={styles.image_container}>
      <div
        className={classNames(styles.image, { [styles.disable_zoom_effect]: disableZoomEffect }, className)}
        style={backgroundImageFromUrl(src)}
        {...props}
      />
    </div>
  );
}
