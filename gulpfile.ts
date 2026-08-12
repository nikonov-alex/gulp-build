import gulp from "gulp";
import civet from "gulp-civet";
import ts from "gulp-typescript";
const typescript = ts.createProject( "tsconfig.json" );
import babel from "gulp-babel";


const build = () =>
    gulp.src( "index.civet" )
        .pipe( civet( {
            extension: '.ts',
            js: false
        } ) )
        .pipe( typescript() )
        .pipe( babel( {
            presets: [
                 //@ts-ignore
                ["@babel/preset-env", {
                    modules: "commonjs"
                }]
            ]
        } ) )
        .pipe( gulp.dest( "." ) );


export default build;