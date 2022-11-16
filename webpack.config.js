const path = require("path");

module.exports = {
  mode: "none",
  entry: {
    "turbo.min": {
      import: "./src/index.js",
      library: {
        type: "commonjs-module",
      },
    },
  },
  output: {
    libraryExport: "default",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, //不转换的文件
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  experiments: {
    outputModule: true,
  },
  optimization: {
    minimize: true,
  },
};
