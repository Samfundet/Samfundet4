import { useMobile } from '~/hooks';
import { SultenButton } from '../SultenButton';
import styles from './SultenCard.module.scss';

type SultenCardProps = {
  header: string;
  image: string;
  imageAlt: string;
  text?: string;
  buttonText?: string;
  imageAlignment?: 'left' | 'right';
  onButtonClick?: () => void;
};

export function SultenCard({
  header,
  image,
  imageAlt,
  text,
  buttonText,
  onButtonClick,
  imageAlignment = 'left',
}: SultenCardProps) {
  const alignImageLeft = imageAlignment === 'left';
  const isMobile = useMobile();

  // position image to the left, or top if mobile
  const leftAlignedImage = (alignImageLeft || isMobile) && (
    <img src={image} alt={imageAlt} className={styles.card_image}></img>
  );

  // position image to the right, not at the bottom if mobile
  const rightAlignedImage = !alignImageLeft && !isMobile && (
    <img src={image} alt={imageAlt} className={styles.card_image}></img>
  );

  const cardButton = buttonText && (
    <SultenButton onClick={onButtonClick} className={styles.card_button}>
      {buttonText}
    </SultenButton>
  );

  return (
    <div className={styles.container}>
      {leftAlignedImage}
      <div className={styles.text_container}>
        <h2 className={styles.card_header}>{header}</h2>
        <p className={styles.card_text}>{text}</p>
        {cardButton}
      </div>
      {rightAlignedImage}
    </div>
  );
}
