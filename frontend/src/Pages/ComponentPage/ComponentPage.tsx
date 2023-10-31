import { Button, Countdown, InputField, ProgressBar, RadioButton } from '~/Components';
import { DayColumn } from '~/Components/Calendar/DayColumn/DayColumn';
import { Checkbox } from '~/Components/Checkbox';
import { Link } from '~/Components/Link';
import { List } from '~/Components/List';
import { SnowflakesOverlay } from '~/Components/SnowflakesOverlay/SnowflakesOverlay';
import { norwegianFlag } from '~/assets';
import { HOUR_MILLIS, MINUTE_MILLIS } from '~/constants';
import styles from './ComponentPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */

const baseDate = new Date('2023-11-01T00:00:00Z'); // Set a base date

const events = [
  {
    start: new Date(baseDate.getTime() + 2 * HOUR_MILLIS),
    end: new Date(baseDate.getTime() + 6 * HOUR_MILLIS),
    title: 'Sleep',
  },
  {
    start: new Date(baseDate.getTime() + 3 * HOUR_MILLIS + 30 * MINUTE_MILLIS),
    end: new Date(baseDate.getTime() + 12 * HOUR_MILLIS + 15 * MINUTE_MILLIS),
    title: 'Sleep',
  },
  {
    start: new Date(baseDate.getTime() + 3 * HOUR_MILLIS),
    end: new Date(baseDate.getTime() + 14 * HOUR_MILLIS),
    title: 'Sleep',
  },
  {
    start: new Date(baseDate.getTime() + 9 * HOUR_MILLIS),
    end: new Date(baseDate.getTime() + 11 * HOUR_MILLIS),
    title: 'Meeting',
  },
  {
    start: new Date(baseDate.getTime() + 10 * HOUR_MILLIS),
    end: new Date(baseDate.getTime() + 12 * HOUR_MILLIS),
    title: 'Meeting',
  },
  {
    start: new Date(baseDate.getTime() + 18 * HOUR_MILLIS),
    end: new Date(baseDate.getTime() + 22 * HOUR_MILLIS),
    title: 'Meeting',
  },
];

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
        <SnowflakesOverlay />
        <h2>
          <Countdown targetDate={new Date(new Date().getTime() + HOUR_MILLIS)}>
            <img src={norwegianFlag}></img>
          </Countdown>
        </h2>
      </div>
      <div>
        <h2>Calendar:</h2>
        <p>See Calendar component in Components folder</p>
        <div>
          <DayColumn events={events} />
        </div>
      </div>
    </div>
  );
}
