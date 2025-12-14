import { Icon } from '@iconify/react';
import { addDays, addMinutes } from 'date-fns';
import { useState } from 'react';
import {
  Block,
  BlockContainer,
  BlockContent,
  BlockFooter,
  BlockTitle,
  Button,
  Countdown,
  EventCard,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  InputField,
  Page,
  ProgressBar,
  RadioButton,
  ToolTip,
} from '~/Components';
import { Checkbox } from '~/Components/Checkbox';
import { Link } from '~/Components/Link';
import { List } from '~/Components/List';
import { MultiSelect } from '~/Components/MultiSelect';
import { ShrimpFishing } from '~/Components/ShrimpFishing/ShrimpFishing';
import { SnowflakesOverlay } from '~/Components/SnowflakesOverlay/SnowflakesOverlay';
import { ExampleForm } from '~/Pages/ComponentPage/ExampleForm';
import type { BilligEventDto } from '~/apis/billig/billigDtos';
import { norwegianFlag } from '~/assets';
import { HOUR_MILLIS } from '~/constants';
import type { EventDto } from '~/dto';
import styles from './ComponentPage.module.scss';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function ComponentPage() {
  const [showShrimpFishing, setShowShrimpFishing] = useState(false);

  const event: EventDto = {
    age_restriction: 'eighteen',
    category: 'concert',
    custom_tickets: [],
    description_long_en: '',
    description_long_nb: '',
    description_short_en: "Von August's coming to Samfundet with their dreamy synth and heartfelt vocal harmonies!",
    description_short_nb: 'Von August kommer til Samfundet med sin drømmende synth og indelige vokalharmonier!',
    duration: 60,
    end_dt: new Date().toISOString(),
    event_group: {
      id: 1,
      name: 'foobar',
    },
    host: 'KLST',
    id: 1,
    image_url: '',
    location: 'Vuelie',
    publish_dt: new Date().toISOString(),
    start_dt: new Date().toISOString(),
    status: 'active',
    ticket_type: 'free',
    title_en: 'Von August with a very long title just like this // 23:59',
    title_nb: 'Von August // 23:59',
  };

  const billigEvent: BilligEventDto = {
    is_almost_sold_out: false,
    id: 0,
    in_same_period: '',
    is_sold_out: false,
    name: '',
    sale_from: '',
    sale_to: '',
    ticket_groups: [],
  };

  return (
    <Page className={styles.wrapper}>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {/* @formatter:off */}
        <EventCard event={{ ...event, billig: { ...billigEvent, is_almost_sold_out: true } }} />
        <EventCard
          event={{
            ...event,
            start_dt: addDays(new Date(), 1).toISOString(),
            location: 'Storsalen',
            billig: { ...billigEvent, is_sold_out: true },
          }}
        />
        <EventCard
          event={{ ...event, start_dt: addDays(addMinutes(new Date(), 87), 5).toISOString(), location: 'Hele huset' }}
        />
        {/* @formatter:on */}
      </div>

      <br />

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

      <BlockContainer>
        <Block theme="green">
          <BlockContent>
            <BlockTitle>
              Samfundet
              <br /> har
              <br /> opptak!
            </BlockTitle>
          </BlockContent>
          <BlockFooter
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            <div>Frist i dag</div>
            <span style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Les mer
              <Icon icon="line-md:arrow-up" width={16} rotate={1} />
            </span>
          </BlockFooter>
        </Block>
      </BlockContainer>

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
    </Page>
  );
}
