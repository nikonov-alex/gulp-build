"use strict";

require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.iterator.constructor.js");
require("core-js/modules/es.iterator.filter.js");
require("core-js/modules/es.iterator.for-each.js");
require("core-js/modules/es.iterator.map.js");
require("core-js/modules/es.object.define-properties.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = exports.esbuild = exports["default"] = exports.civet = exports.babel = void 0;
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.error.to-string.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.string.replace-all.js");
var _gulp = _interopRequireDefault(require("gulp"));
var _gulpRename = _interopRequireDefault(require("gulp-rename"));
var _gulpTransform = _interopRequireDefault(require("gulp-transform"));
var _gulpCivet = _interopRequireDefault(require("gulp-civet"));
var _gulpTypescript = _interopRequireDefault(require("gulp-typescript"));
var _gulpBabel = _interopRequireDefault(require("gulp-babel"));
var _gulpEsbuild = _interopRequireDefault(require("./lib/gulp-esbuild"));
var _gulpTerser = _interopRequireDefault(require("gulp-terser"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ORIGINAL_EXTENSION = "originalExtension";
var map = exports.map = function map(plugin) {
  return function (instream) {
    var outstream = instream.pipe(plugin);
    //@ts-ignore
    outstream._meta = instream._meta;
    return outstream;
  };
};
var attachMetadata = function attachMetadata(stream, data) {
  var ref;
  if ("_meta" in stream) {
    ref = stream._meta;
  } else ref = {};
  var meta = ref;
  //@ts-ignore//@ts-ignore
  stream._meta = _objectSpread(_objectSpread({}, meta), data);
  //@ts-ignore
  return stream;
};
var hasMetadata = function hasMetadata(stream, key) {
  return "_meta" in stream && _typeof(stream._meta) === "object" && null !== stream._meta && key in stream._meta;
};
var getMetadata = function getMetadata(stream, key) {
  return stream._meta[key];
};
var civet = exports.civet = function civet(stream) {
  return attachMetadata(map((0, _gulpTransform["default"])("utf8", function ($) {
    return $.replaceAll(/\.civet/gi, "");
  }))(map((0, _gulpCivet["default"])({
    extension: '.ts',
    js: false
  }))(stream)), _defineProperty({}, ORIGINAL_EXTENSION, ".civet"));
};
var babel = exports.babel = function babel(stream) {
  return map((0, _gulpBabel["default"])({
    presets: [
    //@ts-ignore
    ["@babel/preset-env", {
      useBuiltIns: "usage",
      corejs: "3.49"
    }]]
  }))(stream);
};
var esbuild = exports.esbuild = function esbuild(entry, outfile) {
  return function (stream) {
    var maybeRestoreExtnames = function maybeRestoreExtnames(stream) {
      if (!hasMetadata(stream, ORIGINAL_EXTENSION)) {
        return stream;
      } else return function (extname) {
        if (!(typeof extname === "string" && extname)) {
          return stream;
        } else return map((0, _gulpRename["default"])({
          extname: extname
        }))(stream);
      }(getMetadata(stream, ORIGINAL_EXTENSION));
    };
    return map((0, _gulpRename["default"])(outfile))(map((0, _gulpEsbuild["default"])({
      entry: entry,
      bundle: true,
      loader: {
        ".civet": "js"
      },
      resolveExtensions: [".js", ".jsx", ".mjs", ".civet"]
    }))(maybeRestoreExtnames(stream)));
  };
};
var makeTask = function makeTask(_ref) {
  var input = _ref.input,
    output = _ref.output;
  var typescript = _gulpTypescript["default"].createProject("tsconfig.json");
  return function () {
    return map(_gulp["default"].dest(output.dir))(map((0, _gulpTerser["default"])())(esbuild(input.entry, output.filename)(babel(map(typescript())(civet(_gulp["default"].src(input.files)))))));
  };
};
var _default = exports["default"] = makeTask;