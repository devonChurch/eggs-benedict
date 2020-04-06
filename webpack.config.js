const { NODE_ENV } = process.env;
const path = require("path");
const PRODUCTION = "production";
const DEVELOPMENT = "development";
const isProduction = NODE_ENV === PRODUCTION;
const srcDir = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "dist");

module.exports = {
  mode: isProduction ? PRODUCTION : DEVELOPMENT,

  entry: "./src/index.tsx",

  output: {
    path: distDir,
    filename: "index.js",
    library: "eggs-benedict",
    libraryTarget: "umd",
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
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

  externals: {
    react: {
      root: "React",
      commonjs: "react",
      commonjs2: "react",
    },
  },

  watch: !isProduction,
};
