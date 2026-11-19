import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isValidBannerUrl, normalizeBannerUrl } from '~/domain/sitebanner/utils';

test('normalizes Samfundet links without a scheme and preserves the destination', () => {
  for (const [input, expected] of [
    ['samfundet.no/login', '/login'],
    [' www.Samfundet.no/events/?search=test#tickets ', '/events/?search=test#tickets'],
    ['samfundet.no', '/'],
    ['samfundet.no?search=test', '/?search=test'],
    ['samfundet.no#top', '/#top'],
    ['/events/', '/events/'],
    ['https://www.uka.no/', 'https://www.uka.no/'],
    ['https://samfundet.no/login', 'https://samfundet.no/login'],
    ['', ''],
  ]) {
    assert.equal(normalizeBannerUrl(input), expected);
    assert.equal(isValidBannerUrl(input), true, input);
  }
});

test('rejects unsafe links and hosts that only resemble samfundet.no', () => {
  for (const input of [
    'samfundet.no.example.com/login',
    'samfundet.no@example.com/login',
    'samfundet.no//example.com',
    'samfundet.no/\\example.com',
    '//example.com',
    '/\\example.com',
    '/\t/example.com',
    'https://',
    'https:example.com',
    'javascript:alert(1)',
    'data:text/html,test',
    'ftp://example.com',
    'not a link',
  ]) {
    assert.equal(isValidBannerUrl(input), false, input);
  }
});
