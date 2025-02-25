const path = require("path");
const DtsBundleWebpack = require("dts-bundle-webpack");

module.exports = {
  entry: "./src/index.ts",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "better-suncalc",
      type: "umd",
    },
    globalObject: "this",
  },
  plugins: [
    new DtsBundleWebpack({
      name: "better-suncalc",
      main: "dist/src/index.d.ts",
      baseDir: "dist",
      out: "index.d.ts",
    }),
  ],
};
