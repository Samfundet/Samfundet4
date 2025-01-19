import { useState } from 'react';
import { Button, Countdown, H1, H2, H3, H4, H5, H6, InputField, ProgressBar, RadioButton, ToolTip } from '~/Components';
import { Checkbox } from '~/Components/Checkbox';
import { Link } from '~/Components/Link';
import { List } from '~/Components/List';
import { MultiSelect } from '~/Components/MultiSelect';
import { ShrimpFishing } from '~/Components/ShrimpFishing/ShrimpFishing';
import { SnowflakesOverlay } from '~/Components/SnowflakesOverlay/SnowflakesOverlay';
import { ExampleForm } from '~/Pages/ComponentPage/ExampleForm';
import { norwegianFlag } from '~/assets';
import { HOUR_MILLIS } from '~/constants';
import styles from './ComponentPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function ComponentPage() {
  const [showShrimpFishing, setShowShrimpFishing] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div>
        <H1>Example form</H1>

        <ExampleForm />
      </div>

      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <H5>Heading 5</H5>
      <H6>Heading 6</H6>

      <br />

      <MultiSelect options={Array.from({ length: 20 }).map((_, i) => ({ label: String(i), value: i }))} />
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
        <Checkbox />
        <br />
        <Checkbox checked readOnly />
        <br />
        <Checkbox disabled />
        <br />
        <Checkbox checked disabled />
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
            <img src={norwegianFlag} alt="Flag" />
          </Countdown>
        </h2>
      </div>
      <Button type="button" onClick={() => setShowShrimpFishing(true)}>
        Start rekefisking?
      </Button>
      {showShrimpFishing && <ShrimpFishing />}
    </div>
  );
}
