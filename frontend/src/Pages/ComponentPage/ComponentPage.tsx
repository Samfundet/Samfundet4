import { Button, Input, ProgressBar, RadioButton } from '~/Components';
import { Checkbox } from '~/Components/Checkbox';
import { Link } from '~/Components/Link';
import { List } from '~/Components/List';
import styles from './ComponentPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function ComponentPage() {
  return (
    <div className={styles.wrapper}>
      <p>
        <div>Buttons:</div>
        <Button>Test</Button>
        <br />
        <Button disabled>Disabled</Button>
        <br />
        <Button theme="secondary">Secondary</Button>
      </p>
      <p>
        <div>Checkboxes:</div>
        <Checkbox label="Unchecked" />
        <br />
        <Checkbox label="Checked" checked />
        <br />
        <Checkbox label="Disabled" disabled />
      </p>
      <p>
        <div>Radiobuttons:</div>
        <RadioButton>Unchecked</RadioButton>
        <br />
        <RadioButton checked>Checked</RadioButton>
        <br />
        <RadioButton disabled>Disabled</RadioButton>
      </p>
      <p>
        <div>Inputs:</div>
        <Input>Label</Input>
      </p>
      <p>
        <div>Links:</div>
        <Link>Link</Link>
      </p>
      <p>
        <div>List:</div>
        <List items={['1', '2', '3']} type={'ordered'} />
      </p>
      <p>
        <div>ProgressBar:</div>
        <ProgressBar value={75} max={100} />
      </p>
    </div>
  );
}
