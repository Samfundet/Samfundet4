import { Button, Countdown, InputField, ProgressBar, RadioButton } from '~/Components';
import { Checkbox } from '~/Components/Checkbox';
import { Link } from '~/Components/Link';
import { List } from '~/Components/List';
import { norwegianFlag } from '~/assets';
import { HOUR_MILLIS } from '~/constants';
import styles from './ComponentPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function ComponentPage() {
  return (
    <div className={styles.wrapper}>
      <h1>Components:</h1>
      <div>
        <h2>Buttons:</h2>
        <Button theme="samf">Test</Button>
        <br />
        <Button theme="samf" disabled>
          Disabled
        </Button>
        <br />
        <Button theme="secondary">Secondary</Button>
      </div>
      <div>
        <h2>Checkboxes:</h2>
        <Checkbox label="Unchecked" />
        <br />
        <Checkbox label="Checked" />
        <br />
        <Checkbox label="Disabled" disabled />
      </div>
      <div>
        <h2>Radiobuttons:</h2>
        <RadioButton>Unchecked</RadioButton>
        <br />
        <RadioButton defaultChecked>Checked</RadioButton>
        <br />
        <RadioButton disabled>Disabled</RadioButton>
      </div>
      <div>
        <h2>Inputs:</h2>
        <InputField>Label</InputField>
      </div>
      <div>
        <h2>Links:</h2>
        <Link url="">Link</Link>
      </div>
      <div>
        <h2>List:</h2>
        <List items={['1', '2', '3']} type={'ordered'} />
      </div>
      <div>
        <h2>ProgressBar:</h2>
        <ProgressBar value={75} max={100} />
      </div>
      <div>
        <h2>
          <Countdown targetDate={new Date(new Date().getTime() + HOUR_MILLIS)}>
            <img src={norwegianFlag}></img>
          </Countdown>
        </h2>
      </div>
    </div>
  );
}
