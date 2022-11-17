import styles from './Footer.module.scss';
import { SocialIcon } from 'react-social-icons';
import {uka, isfit, kulturRom, reitan, trondheimKommune } from '~/assets';
import internal from 'stream';

type FooterProps = {
  iconSize: Number 
}

export function Footer({iconSize}:FooterProps){
  return <div>
  <div className={styles.sponsor}>
    <ul className={styles.centerUL}>
      <li className={styles.horisontalLi}>
        <ul className={styles.centerUL}>
          <li>
          Sponsorer
          </li>
          <li  className={styles.horisontalLi}>
              <span className={styles.sponsorBox}>
                <a href="https://www.trondheim.kommune.no/"> 
                  <img src={trondheimKommune}  className={styles.kommuneIcon}/>
                  Trondheim Kommune
                </a>
              </span>
              <span className={styles.sponsorBox}>
                <a href="https://www.kulturrom.no/">
                  <img src={kulturRom} className={styles.kulturromIcon}/>
                </a>
              </span>
              <span className={styles.sponsorBox}>
                <a href="https://reitan.no/no">
                  <img src={reitan} className={styles.reitanIcon}/>
                </a>
              </span>
          </li>
        </ul>
      </li>
      <li className={styles.horisontalLi}>
        <ul className={styles.centerUL}>
          <li>
            Festivaler
          </li>
          <li className={styles.horisontalLi}>
              <span className={styles.sponsorBox}>
                <a href="https://www.isfit.org/">
                  <img src={isfit}  className={styles.isfitIcon}/>
                </a>
              </span>
              <span className={styles.sponsorBox}>
                <a href="https://uka.no"> 
                  <img src={uka} className={styles.ukaIcon}/>
                </a>
              </span>
          </li>
        </ul>
        </li>
    </ul>
  </div>
  <div  className={styles.social}>
    <ul className={styles.contact}>
      <li>
        <a href={'https://www.samfundet.no/informasjon/kontaktinfo'}> Lurer du på noe? Kontakt oss</a>
      </li>
    </ul>
    <ul>
      <li>
        <span className={styles.leftbox}>
          Facebook &nbsp;                    
          <SocialIcon url="https://facebook.com/samfundet" style={{ height: iconSize, width: iconSize }}/>
        </span>
        <span className={styles.rightbox}>&copy; Studentersamfundet i Trondhjem</span>
      </li>
      <li>
        <span className={styles.leftbox}>
          Instagram &nbsp;
          <SocialIcon url='https://instagram.com/samfundet' style={{ height: iconSize, width: iconSize }}/>
        </span>
        <span className={styles.rightbox}>Org.nr: 970 088 466</span>
      </li>
      <li>
        <span className={styles.leftbox}>
          Spotify &nbsp;
          <SocialIcon url='https://open.spotify.com/user/samfundet' style={{ height: iconSize, width: iconSize }}/>
        </span>
        <span className={styles.rightbox}>Elgeseter gate 1 </span>
      </li>
      <li>
        <div className={styles.leftbox}>
          Twitter &nbsp;
          <SocialIcon url='https://twitter.com/samfundet' style={{ height: iconSize, width: iconSize }}/>
        </div>
        <div className={styles.rightbox}>7030 Trondheim</div>
      </li>
    </ul>

    <p className={styles.cookies}>
    Vi bruker cookies for å gi deg en best mulig opplevelse på Samfundet.no. Les mer om cookies <a href='http://www.whatarecookies.com/'> her.</a>
    </p>
  </div>
</div>
}
