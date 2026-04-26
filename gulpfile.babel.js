import gulp from "gulp"
import { map, civet } from "./index.js";
import ts from "gulp-typescript";
const typescript = ts.createProject( "tsconfig.json" );
import babel from "gulp-babel"


const build = () =>
    gulp.src( [
        "./index.civet",
        "./lib/gulp-civet.d.ts"
    ] )
        |> civet
        |> map( typescript() )
        |> map( babel() )
        |> map( gulp.dest( "." ) )


export default build;