declare module 'gulp-civet' {

    type Options = {
        extension?: string
    } & import( "@danielx/civet" ).CompileOptions;

    const Constructor: { ( options: Options ): NodeJS.ReadWriteStream };

    export default Constructor;

}