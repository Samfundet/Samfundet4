import { useMobile } from '~/hooks';
import { SultenButton } from '../SultenButton';
import styles from './SultenCard.module.scss';

type SultenCardProps = {
  header: string;
  image: string;
  imageAlt: string;
  text: string;
  buttonText?: string;
  imageAlignment?: 'left' | 'right';
};

export function SultenCard({ header, image, imageAlt, text, buttonText, imageAlignment = 'left' }: SultenCardProps) {
  const imageLeft = imageAlignment === 'left';
  const isMobile = useMobile();

  const leftAlignedImage = (imageLeft || isMobile) && (
    <img src={image} alt={imageAlt} className={styles.card_image}></img>
  );
  const rightAlignedImage = !imageLeft && !isMobile && (
    <img src={image} alt={imageAlt} className={styles.card_image}></img>
  );

  return (
    <div className={styles.container}>
      {leftAlignedImage}
      <div className={styles.text_container}>
        <h2 className={styles.card_header}>{header}</h2>
        <p className={styles.card_text}>{text}</p>
        {buttonText && <SultenButton className={styles.card_button}>{buttonText}</SultenButton>}
      </div>
      {rightAlignedImage}
    </div>
  );
}
