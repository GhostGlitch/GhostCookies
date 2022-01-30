// Generated using webpack-cli https://github.com/webpack/webpack-cli
var webpack = require('webpack');
const path = require("path");
const isProduction = process.env.NODE_ENV == "production";
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const config = {
  entry: {
    "GhostCookies": "./src/GhostCookies.js",
  },
  optimization: {
    minimize: !!env.production,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js"
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: require.resolve('jquery'),
      jQuery: require.resolve('jquery')
    }),
    new UnminifiedWebpackPlugin
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        //loader: "babel-loader",
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
