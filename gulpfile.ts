import gulp from "gulp";
import civet from "gulp-civet";


const build = () =>
    gulp.src( "index.civet" )
        .pipe( civet( {
            extension: '.ts',
            js: false
        } ) )
        .pipe( gulp.dest( "." ) );


export default build;