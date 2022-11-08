type ImageProps = {
  src: string;
  height?: number;
  width?: number;
  alt?: string;
  className?: string;
};

export function Image({ src, height, width, alt, className }: ImageProps) {
  return <img src={src} height={height} width={width} alt={alt} className={className} />;
}
