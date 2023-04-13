import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { Options, TYPE } from '~/Components/AdminBox/types';
import { Button } from '../Button';
import styles from './AdminBox.module.scss';

type AdminBoxProps = {
  title: string;
  icon?: string;
  options: Options[];
};

/* TODO 
  TYPE.ADD more options, such as navigation with button links may require react routers
  Test with Posting and such
  Only visual, not any functionality yet
   
  TITLE:
    Header
  OPTIONS: list of json objects: {text:String,url:String,type:String}
  KEYS for different types:
    TYPE.ADD: Creates a green button link, with text
    TYPE.MANAGE: Creates an outlined button link, with text
    TYPE.STEAL: Creates an input Form, where url is post location, text is button text
    TYPE.INFO: Plain text
    TYPE.KILROY: Our demigod of shrimp heaven and hell
*/
export function AdminBox({ title, icon, options }: AdminBoxProps) {
  const navigate = useNavigate();

  return (
    <div className={classNames(styles.applet)}>
      <div className={styles.top}>
        <h1 className={styles.header}>
          {icon && <Icon icon={icon} inline={true}></Icon>}
          {title}
        </h1>
      </div>
      <div className={styles.options}>
        {options.map(function (element, key) {
          if (element.type == TYPE.ADD) {
            return (
              <Button key={key} theme="success" onClick={() => navigate(element.url)} className={styles.button}>
                {' '}
                {element.text}
              </Button>
            );
          } else if (element.type == TYPE.MANAGE) {
            return (
              <Button key={key} theme="outlined" onClick={() => navigate(element.url)} className={styles.button}>
                {element.text}
              </Button>
            );
          } else if (element.type == TYPE.EDIT) {
            return (
              <Button key={key} theme="blue" onClick={() => navigate(element.url)} className={styles.button}>
                {element.text}
              </Button>
            );
          } else if (element.type == TYPE.STEAL) {
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
          } else if (element.type == TYPE.INFO) {
            return (
              <p key={key} className={styles.text}>
                {element.text}
              </p>
            );
          } else if (element.type == TYPE.KILROY) {
            return <div key={key} className={styles.KILROY}></div>;
          }
        })}
      </div>
    </div>
  );
}
