import { COLORS } from '../../types';
import styles from './Infobox.module.scss';

type InfoboxProps = {
  className?: string;
  titel: string;
  img?: string;
  altTxt: string;
  bgColor: string;
  infoTxt: string;
  infoURL: string;
};

export function Infobox({ titel, img, altTxt, infoTxt, bgColor, infoURL }: InfoboxProps) {
  const bg = COLORS[bgColor];
  return (
    <a className={styles.infobox_link} href={infoURL}>
      <div className={styles.infobox_wrap} style={{ backgroundColor: bg }}>
        <div className={styles.img_wrap}>
          <img className={styles.infobox_img} src={img} alt={altTxt}></img>
        </div>
        <div className={styles.infobox_txt_wrap}>
          <h1 className={styles.infobox_h1}>{titel}</h1>
          <p className={styles.infobox_paragraph}>{infoTxt}</p>
        </div>
      </div>
    </a>
  );
}
