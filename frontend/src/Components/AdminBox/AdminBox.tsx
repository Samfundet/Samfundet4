import { Button } from '../Button';
import styles from './AdminBox.module.scss';

type AdminBoxProps = {
  title: string;
  options: Array;
};

const ADD = 'ADD';
const MANAGE = 'MANAGE';
const STEAL = 'STEAL';
const INFO = 'INFO';
const KILROY = 'KILROY';

/* TODO 
  ADD more options, such as navigation with button links may require react routers
  Test with Posting and such
  Only visual, not any functionality yet
   
  TITLE:
    Header
  OPTIONS: list of json objects: {text:String,url:String,type:String}
  KEYS for different types:
    ADD: Creates a green button link, with text
    MANAGE: Creates an outlined button link, with text
    STEAL: Creates an input Form, where url is post location, text is button text
    INFO: Plain text
    KILROY: Our demigod of shrimp heaven and hell



*/
export function AdminBox({ title, options }: AdminBoxProps) {
  return (
    <div className={styles.applet}>
      <div className={styles.top}>
        <h3 className={styles.header}>{title}</h3>
      </div>
      <div className={styles.options}>
        {options.map(function (element, key) {
          if (element.type == ADD) {
            return (
              <Button key={key} theme="success" className={styles.button}>
                {' '}
                {element.text}
              </Button>
            );
          } else if (element.type == MANAGE) {
            return (
              <Button key={key} theme="outlined" className={styles.button}>
                {element.text}
              </Button>
            );
          } else if (element.type == STEAL) {
            return (
              <form key={key} className={styles.search} action={element.url} method="post">
                <div style={{ flex: 1 }}>
                  <input type="text" className={styles.searchInput} placeholder="Navn/ID/E-post" />
                </div>
                <Button theme="samf" className={styles.searchButton}>
                  {element.text}
                </Button>
              </form>
            );
          } else if (element.type == INFO) {
            return (
              <p key={key} className={styles.text}>
                {element.text}
              </p>
            );
          } else if (element.type == KILROY) {
            return <div key={key} className={styles.KILROY}></div>;
          }
        })}
      </div>
    </div>
  );
}
