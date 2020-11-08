import * as path from "path";
import * as webpack from "webpack";

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */

import MiniCssExtractPlugin from "mini-css-extract-plugin";

/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

import TerserPlugin from "terser-webpack-plugin";

import HtmlWebpackPlugin from "html-webpack-plugin";

import ESLintPlugin from "eslint-webpack-plugin";

import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

export default {
  mode: process.env.NODE_ENV == "production" ? "production" : "development",
  entry: "./src/index.ts",

  plugins: [
    new webpack.ProgressPlugin({}),
    new MiniCssExtractPlugin({ filename: "main.[chunkhash].css" }),
    new HtmlWebpackPlugin({
      title: "GPU Substring Search",
      template: path.join(__dirname, "./template/index.html"),
    }),
    new ESLintPlugin({ context: "./src", extensions: ["js", "ts", "tsx"] }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        include: [path.resolve(__dirname, "src")],
        exclude: [/node_modules/],
      },
      {
        test: /.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },

  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: "async",
      minChunks: 1,
      minSize: 30000,
      //name: true
    },
  },
  devServer: { hot: true },
  devtool: "eval-source-map",
  stats: {
    errorDetails: true,
  },
};
