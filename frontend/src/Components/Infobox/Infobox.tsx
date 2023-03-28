import styles from './Infobox.module.scss';
type InfoboxProps = {
  className?: string;
  title: string;
  img?: string;
  bgColor: string;
  infoTxt: string;
  infoURL?: string;
};

export function Infobox({ title, img, infoTxt, bgColor, infoURL }: InfoboxProps) {
  const bg = bgColor;
  if (img && infoURL) {
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
  if (!img && infoURL) {
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
  if (img && !infoURL) {
    return (
      <div className={styles.infobox_wrap} style={{ backgroundColor: bg }}>
        <div className={styles.img_wrap}>
          <img className={styles.infobox_img_noURL} src={img} alt="Image Missing"></img>
        </div>
        <div className={styles.infobox_txt_wrap}>
          <h1 className={styles.no_url_h1}>{title}</h1>
          <p className={styles.infobox_paragraph}>{infoTxt}</p>
        </div>
      </div>
    );
  }
  if (!img && !infoURL) {
    return (
      <div className={styles.no_img_infobox_wrap} style={{ backgroundColor: bg }}>
        <div className={styles.no_img_infobox_txt_wrap}>
          <h1 className={styles.no_url_h1}>{title}</h1>
          <p className={styles.no_img_infobox_paragraph}>{infoTxt}</p>
        </div>
      </div>
    );
  }
  //default
  return (
    <div className={styles.no_img_infobox_wrap} style={{ backgroundColor: bg }}>
      <div className={styles.no_img_infobox_txt_wrap}>
        <h1 className={styles.no_url_h1}>{title}</h1>
        <p className={styles.no_img_infobox_paragraph}>{infoTxt}</p>
      </div>
    </div>
  );
}
