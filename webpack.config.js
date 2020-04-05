const path = require("path");
const { NODE_ENV } = process.env;
const PRODUCTION = "production";
const DEVELOPMENT = "development";
const isProduction = NODE_ENV === PRODUCTION;
const srcDir = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "dist");

module.exports = {
  mode: isProduction ? PRODUCTION : DEVELOPMENT,
  entry: "./src/index.ts",
  output: {
    path: distDir,
    filename: "index.js",
    library: "eggs-benedict",
    libraryTarget: "umd",
  },

  module: {
    rules: [
      {
        test: /\.(ts)|(tsx)$/,
        use: "ts-loader",
        include: srcDir,
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts"],
  },

  devtool: isProduction ? "source-map" : "inline-source-map",

  target: "web",

  /** @todo */
  // externals: ["react", /^@angular/],

  watch: !isProduction,
};
