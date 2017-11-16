const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const BUILD_PATH = path.resolve(__dirname, './build');
const JS_ENTRY_PATH = path.resolve(__dirname, './src/index.js');
const HTML_ENTRY_PATH = path.resolve(__dirname, './src/index.html');
const htmlWebpackPlugin = getHtmlWebpackPlugin();
const extractSassPlugin = getExtractSassPlugin();

module.exports = {
    entry: JS_ENTRY_PATH,
    output: {
        path: BUILD_PATH,
        filename: 'build.[chunkhash].js'
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            {
                test: /\.scss|.css$/,
                use: extractSassPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { sourceMap: true } },
                        { loader: 'sass-loader', options: { sourceMap: true } }
                    ]
                })
            }
        ]
    },
    plugins: [
        htmlWebpackPlugin,
        extractSassPlugin,
        new CopyWebpackPlugin([
            { from: 'images', to: 'images' }
        ])
    ]
};

function getHtmlWebpackPlugin () {
    return new HtmlWebpackPlugin({
        template: HTML_ENTRY_PATH,
        filename: 'index.html',
        inject: false
    });
}

function getExtractSassPlugin () {
    return new ExtractTextPlugin({
        filename: '[name].[contenthash].css',
        disable: process.env.NODE_ENV === 'development'
    });
}
