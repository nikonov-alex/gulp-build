import esbuildBundler from "./lib/gulp-esbuild";
type Stream = NodeJS.ReadWriteStream;
declare const map: (plugin: Stream) => (instream: Stream) => NodeJS.ReadWriteStream;
declare const civet: (stream: Stream) => NodeJS.ReadWriteStream & {
    _meta: {
        originalExtension: string;
    };
};
declare const babel: (stream: Stream) => NodeJS.ReadWriteStream;
type BundlerOptions = Omit<esbuildBundler.Options, "entry">;
declare const esbuild: (entry: string, outfile: string, options?: BundlerOptions) => (stream: Stream) => NodeJS.ReadWriteStream;
declare const makeTask: ({ input, output, ...options }: {
    input: {
        files: string | string[];
        entry: string;
    };
    output: {
        dir: string;
        filename: string;
    };
    esbuild?: BundlerOptions;
}) => () => NodeJS.ReadWriteStream;
export { map, civet, babel, esbuild };
export default makeTask;
