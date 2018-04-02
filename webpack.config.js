const path = require('path');
const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'digraph.js',
    sourceMapFilename: 'digraph.js.map',
    libraryExport: 'default'
  },
  devtool: "source-map",
  plugins: [
    new UglifyJsPlugin({
      parallel: true,
      sourceMap: true
    })
  ]
};

module.exports = config;
