const { NODE_ENV } = process.env;
const path = require("path");
const PRODUCTION = "production";
const DEVELOPMENT = "development";
const isProduction = NODE_ENV === PRODUCTION;
const srcDir = path.resolve(__dirname, "src");
const rootDir = path.resolve(__dirname);

module.exports = {
  mode: isProduction ? PRODUCTION : DEVELOPMENT,

  entry: {
    index: "./src/index.ts",
    hooks: "./src/hooks.tsx",
  },

  output: {
    path: rootDir,
    filename: "[name].js",
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
