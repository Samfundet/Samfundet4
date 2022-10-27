"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyTo = keyTo;
exports.iconFor = iconFor;
exports.maskFor = maskFor;
exports.colorFor = colorFor;
exports.keyFor = keyFor;
exports.keysFor = keysFor;
exports.KEYS = exports.DEFAULT_KEY = void 0;

var _networksDb = _interopRequireDefault(require("./_networks-db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_KEY = 'sharethis';
exports.DEFAULT_KEY = DEFAULT_KEY;
var KEYS = Object.keys(_networksDb.default);
exports.KEYS = KEYS;

var sortLongestFirst = function sortLongestFirst(arr) {
  return arr.sort(function (pre, post) {
    return post.length - pre.length;
  });
};

var KEYS_REGEX = new RegExp('(?:https?:\\/\\/(?:[a-z0-9-]*.)?)?(' + sortLongestFirst(KEYS).join('|') + ').*');

function keyTo(key, _ref) {
  var icon = _ref.icon,
      mask = _ref.mask,
      color = _ref.color;
  _networksDb.default[key] = {
    icon: icon,
    mask: mask,
    color: color
  };
}

function iconFor(key) {
  return _networksDb.default[key] ? _networksDb.default[key].icon : null;
}

function maskFor(key) {
  return _networksDb.default[key] ? _networksDb.default[key].mask : null;
}

function colorFor(key) {
  return _networksDb.default[key] ? _networksDb.default[key].color : null;
}

function keyFor(url) {
  if (!url) {
    return DEFAULT_KEY;
  }

  var key = url.replace(KEYS_REGEX, '$1');
  return key === url ? DEFAULT_KEY : key;
}

function keysFor(urls) {
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return [];
  }

  return urls.map(keyFor);
}