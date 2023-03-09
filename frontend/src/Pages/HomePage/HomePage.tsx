import { getCsrfToken, getSaksdokumenter, getUser, login, logout } from '~/api';
import splash from '~/assets/banner-sample.jpg';
import { useAuthContext } from '~/AuthContext';
import { Button } from '~/Components';
import { SAMFUNDET_ADD_EVENT } from '~/permissions';
import { hasPerm } from '~/utils';
import styles from './HomePage.module.scss';

export function HomePage() {
  const { setUser } = useAuthContext();
  return (
    <div className={styles.container}>
      <img src={splash} alt="Splash" className={styles.splash} />
      <div className={styles.splash_fade}></div>
      <div className={styles.content}>
        <div className={styles.inner_content}>
          <h1 className={styles.header}>Samfundet4 - Dev</h1>
          <div className={styles.button_row}>
            <Button onClick={() => getCsrfToken()}>csrf</Button>
            <Button onClick={() => login('emilte', 'Django123')}>login</Button>
            <Button onClick={() => getUser()}>user</Button>
            <Button onClick={() => getSaksdokumenter()}>saksdok</Button>
            <Button onClick={() => logout().then(() => setUser(undefined))}>logout</Button>
            <Button
              onClick={() => {
                getUser().then((user) => {
                  setUser(user);
                  console.log(
                    hasPerm({
                      user: user,
                      permission: SAMFUNDET_ADD_EVENT,
                      obj: 339,
                    }),
                  );
                });
              }}
            >
              test
            </Button>
          </div>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <p className={styles.text} key={num}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
