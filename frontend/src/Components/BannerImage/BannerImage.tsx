import splash from '../../assets/splash.jpeg';
import styles from './BannerImage.module.scss';

type BannerImageProps = {
  image: string;
  title?: string;
};

export function BannerImage(props: BannerImageProps) {
  return <div className={styles.bannerImage}>

    
    
    <div className={styles.imageContainer} style={ {backgroundImage: "url(" + splash + ")"}}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          Et kult arrangement!
        </div>
      </div>
    </div>
    
  </div>;
}
