import gulp from "gulp";
import path from 'node:path';
import civet from "gulp-civet";
import ts from "gulp-typescript";
const typescript = ts.createProject("tsconfig.json");
import rename from "gulp-rename";
import esbuild from "./lib/gulp-esbuild";
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import merge from "merge-stream";
import babel from "gulp-babel";
import minify from "gulp-terser";
import postcss from "gulp-postcss";
const map = (plugin) => {
    return (stream) => {
        return stream.pipe(plugin);
    };
};
const id = (value) => value;
const skip = id;
const makeTask = ({ input, output, development, ...options }) => {
    const files = (relative) => {
        return path.join(input.sources, relative);
    };
    const ext = (...extensions) => {
        const globs = extensions.map((ext) => files(`/**/*${ext}`));
        return gulp.src(globs);
    };
    const maybe = (plugin) => {
        if (development) {
            return skip;
        }
        else
            return map(plugin);
    };
    let ref;
    {
        const civets = map(civet({
            extension: '.tsx',
            js: false
        }))(ext(".civet"));
        ref = map(rename({ extname: ".civet" }))(map(typescript())(merge(civets, ext(".d.ts"))));
    }
    ;
    const scripts = ref;
    let ref1;
    {
        const sasses = map(rename({ extname: ".sass" }))(map(sass().on('error', sass.logError))(ext(".sass")));
        const scsses = map(rename({ extname: ".scss" }))(map(sass().on('error', sass.logError))(ext(".scss")));
        ref1 = maybe(postcss())(merge(sasses, scsses));
    }
    ;
    const styles = ref1;
    const bundler = esbuild({
        entry: files(input.entry),
        bundle: true,
        loader: {
            ".civet": "js",
            '.css': 'text',
            '.scss': 'text',
            '.sass': 'text'
        },
        resolveExtensions: [".js", ".jsx", ".mjs", ".civet"],
        ...options.esbuild
    });
    return map(gulp.dest(output.dir))(map(rename(output.filename))(maybe(minify())(maybe(babel())(map(bundler)(merge(scripts, styles))))));
};
export default makeTask;
