/**
 * @type {(files: Array<import('vinyl').BufferFile>) => import('esbuild').Plugin}
 * @argument files - gulp's virtual files
 */
const resolvePlugin = (virtualFiles) => ({
	name: 'resolve-plugin',
	setup(build) {
		async function onLoad(path) {
			const virtualFile = virtualFiles.find((file) => file.path === path)

			if (virtualFile !== undefined) {
				const fileContents = virtualFile.contents.toString()

				if ( [ ".css", ".sass", ".scss" ].includes( virtualFile.extname ) ) {
					const contents = `
						const stylesheet = new CSSStyleSheet();
						stylesheet.replaceSync(${JSON.stringify(fileContents)});
						export default stylesheet;`

					return {
						contents,
						resolveDir: virtualFile.dirname,
						loader: 'js'
					}
				}
				else {
					const customLoader = build.initialOptions.loader && build.initialOptions.loader[virtualFile.extname]
					const loader = customLoader || virtualFile.extname.slice(1)

					return {
						contents: fileContents,
						resolveDir: virtualFile.dirname,
						loader,
					}
				}
			}

			return null
		}

		build.onLoad({filter: /.*/}, ({path}) => onLoad(path))
	},
})

module.exports = resolvePlugin
