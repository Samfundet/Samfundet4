import assert from 'node:assert/strict';
import { test } from 'node:test';
import { siteBannerSchema } from '~/domain/sitebanner/schema';

const formValues = {
  text_nb: 'En melding',
  text_en: 'A message',
  url: '/events/',
  new_tab: false,
  start_at: '2026-10-06T12:00',
  end_at: '2026-10-06T13:00',
};

test('new banners require an end time after the start, and reject invalid dates', () => {
  for (const values of [
    { ...formValues, end_at: formValues.start_at },
    { ...formValues, end_at: '2026-10-06T11:00' },
    { ...formValues, start_at: '' },
    { ...formValues, end_at: '' },
    { ...formValues, start_at: 'invalid' },
    { ...formValues, end_at: 'invalid' },
  ]) {
    assert.equal(siteBannerSchema.safeParse(values).success, false);
  }
  assert.equal(siteBannerSchema.safeParse(formValues).success, true);
});
