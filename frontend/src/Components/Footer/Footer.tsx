import styles from './Footer.module.scss';
import ReactDOM from 'react-dom';
import { SocialIcon } from 'react-social-icons';

export function Footer(){
  return <div className={styles.footer}>
  <ul className={styles.contact}>
    <li>
      <a href={'https://www.samfundet.no/informasjon/kontaktinfo'}> Lurer du på noe? Kontakt oss</a>
    </li>
  </ul>
  <ul>
    <li>
    <span>
    Facebook &nbsp;                    
    <SocialIcon url="https://facebook.com/samfundet"/>
    </span>
    &emsp; &copy; Studentersamfundet i Trondhjem
    </li>
    <li>
    Instagram &nbsp;
    <SocialIcon url='https://instagram.com/samfundet'/>
    &emsp; Org.nr: 970 088 466
    </li>
    <li>
    Spotify &nbsp;
    <SocialIcon url='https://open.spotify.com/user/samfundet'/>
    &emsp; Elgeseter gate 1
    </li>
    <li>
    Twitter &nbsp;
    <SocialIcon url='https://twitter.com/samfundet'/>
    &emsp; 7030 Trondheim
    </li>
  </ul>

  <p className={styles.cookies}>
  Vi bruker cookies for å gi deg en best mulig opplevelse på Samfundet.no. Les mer om cookies <a href='http://www.whatarecookies.com/'> her.</a>
  </p>
  
</div>

}
