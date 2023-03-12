import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { COLORS } from '../../types';
import styles from './Infobox.module.scss';
type InfoboxProps = {
  className?: string;
  title: string;
  img?: string;
  bgColor: string;
  infoTxt: string;
  infoURL?: string;
  type: 'WithImgWithURL' | 'NoImgWithURL' | 'WithImgNoURL' | 'NoImgNoURL' | 'LongWithImg' | 'LongWithOutImg';
};

export function Infobox({ title, img, infoTxt, bgColor, infoURL, type }: InfoboxProps) {
  const bg = COLORS[bgColor];
  const [wrapHeightRatio, setWrapHeightRatio] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  //This calculates the ratio of a div and the screen.
  //It is used to change style when the div becomes a certain ratio
  //The style is changed to show a "Read more" button on the infobox
  //The useEffect hook is used because an load-eventlistener did not work
  useEffect(() => {
    const wrapHeight = document.getElementById('infoboxLong_wrap_id')?.offsetHeight || 0;
    const screenHeight = screen.height;
    const ratio = wrapHeight / screenHeight;
    setWrapHeightRatio(ratio);
  }, []);
  //This does the same, as the useEffect hook, but when the screen is resized
  window.addEventListener('resize', function () {
    const wrapHeight = document.getElementById('infoboxLong_wrap_id')?.offsetHeight || 0;
    const screenHeight = screen.height;
    const ratio = wrapHeight / screenHeight;
    setWrapHeightRatio(ratio);
  });
  if (type == 'WithImgWithURL') {
    return (
      <a className={styles.with_url} href={infoURL}>
        <div className={styles.infobox_wrap} style={{ backgroundColor: bg }}>
          <div className={styles.img_wrap}>
            <img className={styles.infobox_img} src={img} alt="Image Missing"></img>
          </div>
          <div className={styles.infobox_txt_wrap}>
            <h1 className={styles.infobox_h1}>{title}</h1>
            <p className={styles.infobox_paragraph}>{infoTxt}</p>
          </div>
        </div>
      </a>
    );
  }
  if (type == 'NoImgWithURL') {
    return (
      <a className={styles.with_url} href={infoURL}>
        <div className={styles.no_img_infobox_wrap} style={{ backgroundColor: bg }}>
          <div className={styles.no_img_infobox_txt_wrap}>
            <h1 className={styles.infobox_h1}>{title}</h1>
            <p className={styles.no_img_infobox_paragraph}>{infoTxt}</p>
          </div>
        </div>
      </a>
    );
  }
  if (type == 'WithImgNoURL') {
    return (
      <div className={styles.infobox_wrap} style={{ backgroundColor: bg }}>
        <div className={styles.img_wrap}>
          <img className={styles.infobox_img} src={img} alt="Image Missing"></img>
        </div>
        <div className={styles.infobox_txt_wrap}>
          <h1 className={styles.no_url_h1}>{title}</h1>
          <p className={styles.infobox_paragraph}>{infoTxt}</p>
        </div>
      </div>
    );
  }
  if (type == 'NoImgNoURL') {
    return (
      <div className={styles.no_img_infobox_wrap} style={{ backgroundColor: bg }}>
        <div className={styles.no_img_infobox_txt_wrap}>
          <h1 className={styles.no_url_h1}>{title}</h1>
          <p className={styles.no_img_infobox_paragraph}>{infoTxt}</p>
        </div>
      </div>
    );
  }
  if (type == 'LongWithImg') {
    return (
      <div className={styles.infoboxLong_wrap} style={{ backgroundColor: bg }} id="infoboxLong_wrap_id">
        <div className={styles.infoboxLong_with_img}>
          <img className={styles.infoboxLong_img} src={img} alt="Image Missing"></img>
        </div>
        <div className={styles.infoboxLong_txt_wrap}>
          <h1 className={styles.infoboxLong_h1}>{title}</h1>
          <div>
            <p className={isExpanded ? styles.infoboxLong_paragraph_exp : styles.infoboxLong_paragraph_not}>
              {infoTxt}
            </p>
          </div>
        </div>
        <div className={wrapHeightRatio > 0.25 ? styles.gradient : styles.gradient_none}>
          <button className={styles.expand_btn} onClick={toggleExpansion}>
            {!isExpanded ? t(KEY.see_more) : t(KEY.see_less)}
          </button>
        </div>
      </div>
    );
  }
  if (type == 'LongWithOutImg') {
    return (
      <div className={styles.infoboxLong_wrap} style={{ backgroundColor: bg }} id="infoboxLong_wrap_id">
        <div className={styles.infoboxLong_txt_wrap}>
          <h1 className={styles.infoboxLong_h1}>{title}</h1>
          <div>
            <p>{wrapHeightRatio}</p>
            <p className={isExpanded ? styles.infoboxLong_paragraph_exp : styles.infoboxLong_paragraph_not}>
              {infoTxt}
            </p>
          </div>
        </div>
        <div className={wrapHeightRatio > 0.25 ? styles.gradient : styles.gradient_none}>
          <button className={styles.expand_btn} onClick={toggleExpansion}>
            {!isExpanded ? t(KEY.see_more) : t(KEY.see_less)}
          </button>
        </div>
      </div>
    );
  }
}
