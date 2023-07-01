const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

module.exports = {
    devtool: 'source-map',
    entry: './src/index.ts',
    output: {
        path: resolve(__dirname, './dict'),
        filename: 'script/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, './public/index.html')
        }),
        new CleanWebpackPlugin(),
    ],
    resolve: {
        // 导入自动补全后缀
        extensions: ['.js', '.ts']
    }
};