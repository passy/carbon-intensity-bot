'use strict';

var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        libraryTarget: 'this',
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
            },
            {
                test: /\.purs$/,
                loader: 'purs-loader',
                options: {
                    pscPackage: true,
                    psc: 'psa',
                },
            },
        ],
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ],
    },
    externals: [nodeExternals()]
};
