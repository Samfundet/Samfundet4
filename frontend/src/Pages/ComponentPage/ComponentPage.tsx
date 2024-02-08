
import { Button, Countdown, InputField, MultiSelect, ProgressBar, RadioButton, ToolTip } from '~/Components';
import { Checkbox } from '~/Components/Checkbox';
import { Link } from '~/Components/Link';
import { List } from '~/Components/List';
import { SnowflakesOverlay } from '~/Components/SnowflakesOverlay/SnowflakesOverlay';
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
      <MultiSelect
        options={[
          {
            label: '1',
            value: 1,
          },
          {
            label: '2',
            value: 2,
          },
          {
            label: '3',
            value: 3,
          },
          {
            label: '4',
            value: 4,
          },
          {
            label: '5',
            value: 5,
          },
          {
            label: '6',
            value: 6,
          },
          {
            label: '7',
            value: 7,
          },
          {
            label: '8',
            value: 8,
          },
          {
            label: '9',
            value: 9,
          },
        ]}
      />
      <br />
      <br />
      <br />
      <br />
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
        <h2>Tooltip:</h2>
        <div>
          <ToolTip value="You hovered!">
            <p>Hover on me top text!</p>
          </ToolTip>
        </div>
        <br />
        <div>
          <ToolTip value="You hovered!" alignment="right">
            <p>Hover on me right text!</p>
          </ToolTip>
        </div>
        <br />
        <div>
          <ToolTip display="image" value="https://i.ebayimg.com/images/g/jwMAAOxy5jxSduxZ/s-l1200.webp">
            <p>Hover on me Image!</p>
          </ToolTip>
        </div>
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
        <MultiSelect
          options={[
            { id: '1', value: 'tomato', label: 'tomato' },
            { id: '2', value: 'maaan', label: 'maaan' },
          ]}
        />
      </div>
    </div>
  );
}
