import gulp from "gulp"
import { map, babel } from "./index.js";
import civet from "gulp-civet"
import ts from "gulp-typescript";
const typescript = ts.createProject( "tsconfig.json" );
import terser from 'gulp-terser'


const build = () =>
    gulp.src( [
        "./index.civet",
        "./lib/gulp-civet.d.ts"
    ] )
        |> map( civet( {
            extension: '.ts',
            js: false
        } ) )
        |> map( typescript() )
        |> babel
        |> map( terser() )
        |> map( gulp.dest( "." ) )


export default build;