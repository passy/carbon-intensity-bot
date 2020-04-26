"use strict";

const nodeExternals = require("webpack-node-externals");
const path = require('path');

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  target: "node",
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: "index.js",
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
              psc: "psa",
              spago: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".purs"]
  },
  externals: [
    nodeExternals({whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i]}),
  ]
};
