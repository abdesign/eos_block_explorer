const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const WebpackShellPlugin = require('webpack-shell-plugin');

const frontend = {
  target: 'web',
  entry: {
    app: ['./src/frontend.js']
  },
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: 'bundle-front.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
            envName: "web",
            plugins: ['@babel/proposal-class-properties']
            }
        }
      }
    ]
  },
  devtool: 'inline-source-map',
}


const backend = {
  entry: {
    server: './src/bin/www.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
      extensions: ['.js'],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
            plugins: ['@babel/proposal-class-properties']
            }
        }
      },
      { 
        test: /\.mustache$/,
        loader: 'mustache-loader'
      }
    ]
  }
}

module.exports = [ frontend, backend ];