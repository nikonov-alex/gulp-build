type Stream = NodeJS.ReadWriteStream;
declare const map: (plugin: Stream) => (instream: Stream) => NodeJS.ReadWriteStream;
declare const civet: (stream: Stream) => NodeJS.ReadWriteStream & {
    _meta: {
        originalExtension: string;
    };
};
declare const babel: (stream: Stream) => NodeJS.ReadWriteStream;
declare const esbuild: (entry: string, outfile: string) => (stream: Stream) => NodeJS.ReadWriteStream;
declare const makeTask: ({ input, output }: {
    input: {
        files: string | string[];
        entry: string;
    };
    output: {
        dir: string;
        filename: string;
    };
}) => () => NodeJS.ReadWriteStream;
export { map, civet, babel, esbuild };
export default makeTask;
