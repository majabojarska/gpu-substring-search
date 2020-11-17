import WebpackDevServer from "webpack-dev-server";
import config from "./webpack.config";
import merge from "webpack-merge";
import webpack from "webpack";

export default merge<
  webpack.Configuration | { devServer: WebpackDevServer.Configuration }
>(config, {
  mode: "development",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.SourceMapDevToolPlugin({}),
  ],
  devServer: { hot: true },
  devtool: "inline-source-map",
  stats: {
    errorDetails: true,
  },
});
