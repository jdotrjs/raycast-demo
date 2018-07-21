const path = require('path')
const webpack = require('webpack')
const u = require('./webpack.util.js')

// lists all files rooted at the directory `base`
const fileList = base => u.getFilesIn(u.getDirPath(base))

const main = './src/index.js'
const indexHtml = path.resolve(__dirname, 'src', 'index.html')
const vendor = fileList('vendor')

const sourcePaths = [main, indexHtml].concat(vendor)

module.exports = {
  mode: 'production',
  entry: sourcePaths,

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
  },

  module: {
    rules: [
      {
        test: indexHtml,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },

      {
        test: vendor,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          /vendor/,
        ],
      },
    ],
  },
};