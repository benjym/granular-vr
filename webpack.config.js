const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
        mode: "development",
        // mode: "production",
        entry: {
          index : './js/index.js',
          isotropic : './js/isotropic.js',
          triaxial : './js/triaxial.js'
        },
        plugins: [
          new webpack.ProvidePlugin({
            THREE : 'three'
          }),
          new HtmlWebpackPlugin({
            title: 'NDDEM in VR',
            // favicon: "./resources/favicon512.png",
            template: "index.html",
            chunks: ['index']
          }),
          new HtmlWebpackPlugin({
            title: 'NDDEM in VR',
            // favicon: "./resources/favicon512.png",
            template: "index.html",
            filename: "isotropic.html",
            chunks: ['isotropic']
          }),
          new HtmlWebpackPlugin({
            title: 'NDDEM in VR',
            // favicon: "./resources/favicon512.png",
            template: "index.html",
            filename: "triaxial.html",
            chunks: ['triaxial']
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
