import { getAllPermissions, getCsrfToken, getSaksdokumenter, getUser, login, logout } from '~/api';
import logo from '~/assets/logo_black.png';
import splash from '~/assets/splash.jpeg';
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
      <div className={styles.content}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1>Velkommen til Samfundet og MG::Web!</h1>
        <p className={styles.homeText}>
          Gratulerer! Du har nå fått tutorial-prosjektet opp å kjøre, og alt ser ut til å fungere som det skal! Det
          første som er smart å gjøre er å utforske koden og bli litt kjent med hvordan ting er satt opp.
        </p>
        <Button onClick={() => getCsrfToken()}>csrf</Button>
        <Button onClick={() => login('emilte', 'Django123')}>login</Button>
        <Button onClick={() => getUser()}>user</Button>
        <Button onClick={() => getAllPermissions()}>perms</Button>
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
    </div>
  );
}
