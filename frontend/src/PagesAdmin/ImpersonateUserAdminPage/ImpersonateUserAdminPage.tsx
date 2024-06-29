import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { InputField } from '~/Components';
import { getUsers, impersonateUser } from '~/api';
import bondmusic from '~/assets/memes/jamesbond.mp3';
import type { UserDto } from '~/dto';
import { queryDto } from '~/utils';
import styles from './ImpersonateUserAdminPage.module.scss';

export function ImpersonateUserAdminPage() {
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDto[]>([]);
  useEffect(() => {
    getUsers()
      .then((users) => {
        setUsers(users);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    return <b>You&apos;ve been a bad bad boy</b>;
  }

  const displayUsers = queryDto(query, users, ['username', 'first_name', 'last_name', 'email']).slice(0, 10);

  function verboseUserName(user: UserDto): string {
    if ((user.first_name + user.last_name).length === 0) {
      return 'No name';
    }
    return `${user.first_name} ${user.last_name}`;
  }

  function impersonate(user: UserDto) {
    impersonateUser(user)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  }

  return (
    <>
      <div className={styles.root}>
        <div className={styles.titleBox}>
          <div className={styles.title}>
            <span>Secret Agent Mode</span>
            <Icon icon="icons8:spy" inline={true} />
          </div>
          {/* biome-ignore lint/a11y/useMediaCaption: no captions for james bond music... */}
          <audio controls autoPlay>
            <source src={bondmusic} type="audio/mp3" />
          </audio>
        </div>
        <div className={styles.agentBox}>
          <InputField<string> inputClassName={styles.inputClass} placeholder={'Search...'} onChange={setQuery} />
          <div className={styles.userList}>
            {displayUsers.map((u) => (
              <button type="button" className={styles.userItem} onClick={() => impersonate(u)} key={u.id}>
                <span>{verboseUserName(u)}</span>
                <span className={styles.email}>{u.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
