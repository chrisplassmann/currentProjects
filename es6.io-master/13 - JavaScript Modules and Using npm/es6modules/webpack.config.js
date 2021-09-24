// const { Module } = require('webpack');
const webpack = require('webpack');
const nodeEnv = process.env.NODE_ENV || 'production';

Module.exports = {
    devtool: 'source-map',
    entry: {
        filename: './app.js'
    },
    output: {
        filename: '_build/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015-native-modules']
                }
            }
        ]
    },
    plugins: [
        // uglify js
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings:false},
            output: {comments:false},
            sourcemap: true
        }),
        // environment plugin
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify(nodeEnv)}
        })
    ]

}