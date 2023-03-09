import { useEffect, useState } from 'react';
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
  // wrapHeightRatio: number;
};

export function Infobox({ title, img, infoTxt, bgColor, infoURL, type }: InfoboxProps) {
  const bg = COLORS[bgColor];
  const [wrapHeightRatio, setWrapHeightRatio] = useState<number>(0); // add state variable here
  const [isExpanded, setIsExpanded] = useState(false);
  // const [height, setHeight] = useState<number | null>(null);
  // const ref = useRef<HTMLDivElement>(null);
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  //MULIG useEffect kan hjelpe meg å sørge for at knappen vises på riktig størrelse
  useEffect(() => {
    // if (ref.current && !isExpanded) {
    //   setHeight(ref.current.offsetHeight);
    // }
  }, [isExpanded]);
  window.addEventListener('resize', function () {
    const wrapHeight = document.getElementById('infoboxLong_wrap_id').offsetHeight;
    const screenHeight = screen.height; //endrer fra screen.height til screen.Height
    const ratio = wrapHeight / screenHeight;
    setWrapHeightRatio(ratio);
    // setWrapHeightRatio(wrapHeight);
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
      <div className={styles.infoboxLong_wrap} style={{ backgroundColor: bg }}>
        <div className={styles.infoboxLong_with_img}>
          <img className={styles.infoboxLong_img} src={img} alt="Image Missing"></img>
        </div>
        <div className={styles.infoboxLong_txt_wrap}>
          <h1 className={styles.infoboxLong_h1}>{title}</h1>
          <div>
            <p
              // ref={ref}
              className={isExpanded ? styles.infoboxLong_paragraph_exp : styles.infoboxLong_paragraph_not}
              id="infoboxLong_wrap_id"
            >
              {infoTxt}
            </p>
          </div>
        </div>
        {/* {wrapHeightRatio > 0.15 && ( //har kontroll på tekst størrelsen
          //Snudd > DET FUNKA!
          //Mulig dette har med at funksjonen ikke loades
          <div className={styles.gradient}>
            <button className={styles.expand_btn} onClick={toggleExpansion}>
              {isExpanded ? 'Se minder' : 'Se mer'}
            </button>
          </div>
        )} */}
        <div className={wrapHeightRatio > 0.15 ? styles.gradient : styles.gradient_none}>
          <button className={styles.expand_btn} onClick={toggleExpansion}>
            {!isExpanded ? 'Se mer' : 'Se mindre'}
          </button>
        </div>
      </div>
    );
  }
  if (type == 'LongWithOutImg') {
    return (
      <div className={styles.infoboxLong_wrap} style={{ backgroundColor: bg }}>
        <div className={styles.infoboxLong_txt_wrap}>
          <h1 className={styles.infoboxLong_h1}>{title}</h1>
          <div>
            <p>{wrapHeightRatio}</p>
            <p
              // ref={ref}
              className={!isExpanded ? styles.infoboxLong_paragraph_exp : styles.infoboxLong_paragraph_not}
              id="infoboxLong_wrap_id"
            >
              {infoTxt}
            </p>
          </div>
        </div>
        {/* {wrapHeightRatio > 0.15 && ( )} */}

        <div className={wrapHeightRatio > 0.15 ? styles.gradient : styles.gradient_none}>
          <button className={styles.expand_btn} onClick={toggleExpansion}>
            {!isExpanded ? 'Se mer' : 'Se mindre'}
          </button>
        </div>
      </div>
    );
  }
}
