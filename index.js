"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.iterator.constructor.js");
require("core-js/modules/es.iterator.map.js");
require("core-js/modules/es.json.stringify.js");
var _gulp = _interopRequireDefault(require("gulp"));
var _path = _interopRequireDefault(require("path"));
var _gulpCivet = _interopRequireDefault(require("gulp-civet"));
var _gulpTypescript = _interopRequireDefault(require("gulp-typescript"));
var _gulpRename = _interopRequireDefault(require("gulp-rename"));
var _gulpEsbuild = _interopRequireDefault(require("./lib/gulp-esbuild"));
var _sass = _interopRequireDefault(require("sass"));
var _gulpSass = _interopRequireDefault(require("gulp-sass"));
var _mergeStream = _interopRequireDefault(require("merge-stream"));
var _gulpBabel = _interopRequireDefault(require("gulp-babel"));
var _gulpTerser = _interopRequireDefault(require("gulp-terser"));
var _gulpPostcss = _interopRequireDefault(require("gulp-postcss"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const typescript = _gulpTypescript.default.createProject("tsconfig.json");
const sass = (0, _gulpSass.default)(_sass.default);
const map = plugin => {
  return stream => {
    return stream.pipe(plugin);
  };
};
const id = value => value;
const skip = id;
const readFile = stream => async targetPath => {
  const isVinylFile = file => {
    return !!file && typeof file === 'object' && 'path' in file && 'isBuffer' in file;
  };
  const absoluteTarget = _path.default.resolve(targetPath);
  const results = [];
  for await (const file of stream) {
    if (!(isVinylFile(file) && file.path === absoluteTarget && file.isBuffer())) continue;
    results.push(file.contents.toString('utf8'));
  }
  ;
  const contents = results;
  if (contents.length > 0) {
    return contents[0];
  } else return null;
};
const makeTask = ({
  input,
  output,
  development,
  ...options
}) => {
  const relative = relative => {
    return _path.default.posix.join(input.sources, relative);
  };
  const ext = (...extensions) => {
    const globs = extensions.map(ext => relative(`/**/*${ext}`));
    return _gulp.default.src(globs);
  };
  const maybe = plugin => {
    if (development) {
      return skip;
    } else return map(plugin);
  };
  let ref;
  {
    const civets = map((0, _gulpRename.default)({
      extname: ".civet"
    }))(map(typescript())(map((0, _gulpCivet.default)({
      extension: '.tsx',
      js: false
    }))(ext(".civet", ".d.ts"))));
    ref = civets;
  }
  ;
  const scripts = ref;
  let ref1;
  {
    const sasses = map((0, _gulpRename.default)({
      extname: ".sass"
    }))(map(sass().on('error', sass.logError))(ext(".sass")));
    const scsses = map((0, _gulpRename.default)({
      extname: ".scss"
    }))(map(sass().on('error', sass.logError))(ext(".scss")));
    ref1 = maybe((0, _gulpPostcss.default)())((0, _mergeStream.default)(sasses, scsses));
  }
  ;
  const styles = ref1;
  const stylesPlugin = {
    name: 'css-stylesheet',
    setup(build) {
      const readStyle = readFile(styles);
      return build.onLoad({
        filter: /\.(css|sass|scss)$/
      }, async args => {
        const styles = await readStyle(args.path);
        if (styles === null) {
          return {
            errors: [{
              text: "Failed to read CSS file",
              location: {
                file: args.path
              }
            }]
          };
        } else {
          const contents = `
                        const stylesheet = new CSSStyleSheet();
                        stylesheet.replaceSync(${JSON.stringify(styles)});
                        export default stylesheet;`;
          return {
            contents,
            loader: 'js'
          };
        }
      });
    }
  };
  const bundler = (0, _gulpEsbuild.default)({
    entry: relative(input.entry),
    bundle: true,
    loader: {
      ".civet": "js"
    },
    resolveExtensions: [".js", ".jsx", ".mjs", ".civet"],
    plugins: [stylesPlugin],
    ...options.esbuild
  });
  return () => {
    return map(_gulp.default.dest(output.dir))(map((0, _gulpRename.default)(output.filename))(maybe((0, _gulpTerser.default)())(maybe((0, _gulpBabel.default)())(map(bundler)((0, _mergeStream.default)(scripts, styles))))));
  };
};
var _default = exports.default = makeTask;