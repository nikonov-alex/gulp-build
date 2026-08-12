import esbuild from "./lib/gulp-esbuild";
type BundlerOptions = Omit<esbuild.Options, "entry">;
declare const makeTask: ({ input, output, development, ...options }: {
    input: {
        sources: string;
        entry: string;
    };
    output: {
        dir: string;
        filename: string;
    };
    esbuild?: BundlerOptions;
    development?: boolean;
}) => NodeJS.ReadWriteStream;
export default makeTask;
