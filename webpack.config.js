const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    entry: {
        'video-demo': path.join(__dirname, 'src/videoplayer')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.json', '.html'],
        modules: ['node_modules']
    },
    plugins: [
        new Dotenv({
            safe: true // checks if keys from '.env.example' are present
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        experimentalWatchApi: true
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }
            }
        ]
    },
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        },
        contentBase: path.join(__dirname, 'src/static-files')
    }
};