import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { THEME } from '~/constants';
import { useGlobalContext } from '~/GlobalContextProvider';
import { Button } from '../Button';
import styles from './AdminBox.module.scss';

type AdminBoxProps = {
  title: string;
  icon?: string;
  options: Array<any>;
};

const ADD = 'ADD';
const MANAGE = 'MANAGE';
const EDIT = 'EDIT';
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
export function AdminBox({ title, icon, options }: AdminBoxProps) {
  const navigate = useNavigate();
  const { theme } = useGlobalContext();
  const isDarkTheme = theme === THEME.DARK;
  
  return (
    <div className={classNames(styles.applet, isDarkTheme ? styles.dark_theme : "")}>
      <div className={styles.top}>
        <h1 className={styles.header}>
          {title}
          {icon && <Icon icon={icon} inline={true}></Icon>}
        </h1>
      </div>
      <div className={styles.options}>
        {options.map(function (element, key) {
          if (element.type == ADD) {
            return (
              <Button key={key} theme="success" onClick={() => navigate(element.url)} className={styles.button}>
                {' '}
                {element.text}
              </Button>
            );
          } else if (element.type == MANAGE) {
            return (
              <Button key={key} theme="outlined" onClick={() => navigate(element.url)} className={styles.button}>
                {element.text}
              </Button>
            );
          } else if (element.type == EDIT) {
            return (
              <Button key={key} theme="blue" onClick={() => navigate(element.url)} className={styles.button}>
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
