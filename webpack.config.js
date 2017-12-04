const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const BUILD_PATH = path.resolve(__dirname, './dist');
const HTML_ENTRY_PATH = path.resolve(__dirname, './src/example/index.html');
const htmlWebpackPlugin = getHtmlWebpackPlugin();
const extractSassPlugin = getExtractSassPlugin();

module.exports = {
    entry: {
        'lightningbox': path.resolve(__dirname, './src/targets/browser.js'),
        'lightningbox.umd': path.resolve(__dirname, './src/targets/commonjs.js')
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].min.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
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
            { from: 'src/example/images', to: 'images' }
        ]),
        new UglifyJsPlugin()
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
        filename: 'lightningbox.min.css',
        disable: false
    });
}
