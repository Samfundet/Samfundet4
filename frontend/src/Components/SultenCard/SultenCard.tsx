import { SultenButton } from '~/Components/SultenButton';
import { useMobile } from '~/hooks';
import styles from './SultenCard.module.scss';

type SultenCardProps = {
  header: string;
  image: string;
  imageAlt: string;
  text?: string;
  buttonText?: string;
  imageAlignment?: 'left' | 'right';

  leftAlignImg?: boolean;

  onButtonClick?: () => void;
  link?: string;
  smallCard?: boolean;
};

export function SultenCard({
  header,
  image,
  imageAlt,
  text,
  buttonText,
  onButtonClick,
  link,
  imageAlignment = 'left',
  smallCard = false,
}: SultenCardProps) {
  const alignImageLeft = imageAlignment === 'left';
  const isMobile = useMobile();

  // position image to the left, or top if mobile
  const leftAlignedImage = (alignImageLeft || isMobile) && (
    <img
      src={image}
      alt={imageAlt}
      className={smallCard ? styles.smallcard_image : styles.card_image}
      loading="lazy"
    ></img>
  );

  // position image to the right, not at the bottom if mobile
  const rightAlignedImage = !alignImageLeft && !isMobile && (
    <img
      src={image}
      alt={imageAlt}
      className={smallCard ? styles.smallcard_image : styles.card_image}
      loading="lazy"
    ></img>
  );

  const cardButton = buttonText && (
    <SultenButton onClick={onButtonClick} link={link} className={styles.card_button}>
      {buttonText}
    </SultenButton>
  );

  return (
    <div className={smallCard ? styles.smallcard_container : styles.container}>
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
