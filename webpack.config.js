const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    mode: "development",
    // mode: "production",
    entry: {
      "index": './src/index.js',
      "isotropic": './src/isotropic.js',
      "triaxial": './src/triaxial.js',
      "slice-3d": './src/slice-3d.js',
      "slice-4d": './src/slice-4d.js',
      "rotation-matrix" : './src/rotation-matrix.js',
      "hyperspheres" : './src/hyperspheres.js',
    },
    plugins: [
      new webpack.ProvidePlugin({
        THREE: 'three'
      }),
      new HtmlWebpackPlugin({
        title: 'NDDEM in VR',
        favicon: "./resources/favicon512.png",
        template: "index.html",
        chunks: ['index']
      }),
      new HtmlWebpackPlugin({
        title: 'Isotropic compression',
        favicon: "./resources/favicon512.png",
        template: "index.html",
        filename: "isotropic.html",
        chunks: ['isotropic']
      }),
      new HtmlWebpackPlugin({
        title: 'Triaxial compression',
        favicon: "./resources/favicon512.png",
        template: "index.html",
        filename: "triaxial.html",
        chunks: ['triaxial']
      }),
      new HtmlWebpackPlugin({
        title: 'Slicing 3D Space',
        favicon: "./resources/favicon512.png",
        template: "index.html",
        filename: "slice-3d.html",
        chunks: ['slice-3d']
      }),
      new HtmlWebpackPlugin({
        title: 'Slicing 4D Space',
        favicon: "./resources/favicon512.png",
        template: "index.html",
        filename: "slice-4d.html",
        chunks: ['slice-4d']
      }),
      new HtmlWebpackPlugin({
        title: 'Rotations',
        favicon: "./resources/favicon512.png",
        template: "index.html",
        filename: "rotation-matrix.html",
        chunks: ['rotation-matrix']
      }),
      new HtmlWebpackPlugin({
        title: 'Hyperspheres',
        favicon: "./resources/favicon512.png",
        template: "index.html",
        filename: "hyperspheres.html",
        chunks: ['hyperspheres']
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
        {
          test: /\.(json|png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          use: ["file-loader?name=[name].[ext]"]
        },
      ],
    },
  },
];
