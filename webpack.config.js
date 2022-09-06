const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
        mode: "development",
        // mode: "production",
        entry: {
          "index": './js/index.js',
          "isotropic" : './js/isotropic.js',
          "triaxial" : './js/triaxial'
        },
        plugins: [
          new webpack.ProvidePlugin({
            THREE : 'three'
          })
        ],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name]-bundle.js',
            clean: true,
        },
        devServer: {
            static: {
              directory: '.'
            },
        },
        module: {
            rules: [
              {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
              },
            ],
          },
    },
];
