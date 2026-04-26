import gulp from "gulp"
import { map, babel, civet } from "./index.js";
import ts from "gulp-typescript";
const typescript = ts.createProject( "tsconfig.json" );
import terser from 'gulp-terser'


const build = () =>
    gulp.src( [
        "./index.civet",
        "./lib/gulp-civet.d.ts"
    ] )
        |> civet
        |> map( typescript() )
        |> babel
        |> map( terser() )
        |> map( gulp.dest( "." ) )


export default build;