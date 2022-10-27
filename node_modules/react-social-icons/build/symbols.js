"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _networks = require("./networks.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderBackgroundSymbol() {
  return _react.default.createElement("symbol", {
    id: "background",
    viewBox: "0 0 64 64"
  }, _react.default.createElement("g", {
    className: "social-background"
  }, _react.default.createElement("circle", {
    cx: "32",
    cy: "32",
    r: "31"
  })));
}

function renderSymbols(props) {
  return props.networks.map(function (key) {
    return [_react.default.createElement("symbol", {
      key: key,
      id: "".concat(key, "-icon"),
      viewBox: "0 0 64 64"
    }, _react.default.createElement("g", {
      className: "social-icon"
    }, _react.default.createElement("path", {
      d: (0, _networks.iconFor)(key)
    }))), _react.default.createElement("symbol", {
      key: key,
      id: "".concat(key, "-mask"),
      viewBox: "0 0 64 64"
    }, _react.default.createElement("g", {
      className: "social-mask"
    }, _react.default.createElement("path", {
      d: (0, _networks.maskFor)(key)
    })))];
  });
}

function Symbols(props) {
  return _react.default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    id: "social-symbols",
    version: "1.1"
  }, renderBackgroundSymbol(), renderSymbols(props));
}

Symbols.propTypes = {
  networks: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
};
var _default = Symbols;
exports.default = _default;