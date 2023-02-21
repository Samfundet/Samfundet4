import classNames from 'classnames';
import { COLORS } from '../../types';
import styles from './InfoboxShort.module.scss';

type InfoboxProps = {
  className?: string;
  titel: string;
  img?: string;
  bgColor: string;
  infoTxt: string;
  infoURL?: string;
  withImg: boolean;
  withURL: boolean;
};

export function Infobox({ titel, img, infoTxt, bgColor, infoURL, withImg, withURL }: InfoboxProps) {
  const bg = COLORS[bgColor];
  // applying diffrent styles to support the possibility of not having an image:
  const infobox_wrap_style = classNames({
    [styles.infobox_wrap]: withImg,
    [styles.no_img_infobox_wrap]: !withImg,
  });
  const img_wrap_style = classNames({
    [styles.img_wrap]: withImg,
    [styles.no_img_wrap]: !withImg,
  });
  const img_style = classNames({
    [styles.infobox_img]: withImg,
    [styles.no_img]: !withImg,
  });
  const txt_wrap_style = classNames({
    [styles.infobox_txt_wrap]: withImg,
    [styles.no_img_infobox_txt_wrap]: !withImg,
  });
  const infobox_h1_style = classNames({
    [styles.infobox_h1]: withImg,
    [styles.no_img_h1]: !withImg,
  });
  const infobox_paragraph_style = classNames({
    [styles.infobox_paragraph]: withImg,
    [styles.no_img_infobox_paragraph]: !withImg,
  });
  const url_style = classNames({
    [styles.with_url]: withURL,
    [styles.without_url]: !withURL,
  });
  return (
    <a className={url_style} href={infoURL}>
      <div className={infobox_wrap_style} style={{ backgroundColor: bg }}>
        <div className={img_wrap_style}>
          <img className={img_style} src={img} alt="Image Missing"></img>
        </div>
        <div className={txt_wrap_style}>
          <h1 className={infobox_h1_style}>{titel}</h1>
          <p className={infobox_paragraph_style}>{infoTxt}</p>
        </div>
      </div>
    </a>
  );
}
