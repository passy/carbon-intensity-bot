"use strict";

const nodeExternals = require("webpack-node-externals");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  target: "node",
  output: {
    filename: "lib/index.js",
    libraryTarget: "this"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.purs$/,
        use: [
          {
            loader: "purs-loader",
            options: {
              psc: "psa"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".purs"]
  },
  externals: [nodeExternals()],
  plugins: [
    // new ForkTsCheckerWebpackPlugin()
  ]
};
