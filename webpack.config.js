const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/bin/launch.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    devServer: {
        port: 3000,
    },
    plugins: [
        new HTMLPlugin({
            template: './src/index.html',
        }),
        new CleanWebpackPlugin(),
    ],
}
