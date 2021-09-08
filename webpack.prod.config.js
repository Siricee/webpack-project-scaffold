const { merge } = require("webpack-merge");
const configs = require("./webpack.config.js");

const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(configs, {
    mode: "production",
    optimization: {
        minimizer: [
            new UglifyWebpackPlugin({
                parallel: 4
            }),
            new OptimizeCssAssetsWebpackPlugin(),
        ]
    }
  });