module.exports = {
  presets: [
    ["@babel/preset-env"]
  ],
  plugins: [
    ["polyfill-corejs3", {
        method: "usage-global",
        version: require("core-js/package.json").version,
        proposals: true
    } ]
  ]
};