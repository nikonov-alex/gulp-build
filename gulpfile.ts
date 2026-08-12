import gulp from "gulp";
import civet from "gulp-civet";
import ts from "gulp-typescript";
const typescript = ts.createProject( "tsconfig.json" );


const build = () =>
    gulp.src( "index.civet" )
        .pipe( civet( {
            extension: '.ts',
            js: false
        } ) )
        .pipe( typescript() )
        .pipe( gulp.dest( "." ) );


export default build;