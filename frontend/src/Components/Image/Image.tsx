import classNames from 'classnames';
import styles from './Image.module.scss';

type ImageProps = {
  src: string;
  height?: number;
  width?: number;
  alt?: string;
  className?: string;
  altText?: boolean;
};

export function Image({ src, height, width, alt, className, altText }: ImageProps) {
  return <img src={src} height={height} width={width} alt={alt} className={classNames(styles.altText, className)} />;
}
