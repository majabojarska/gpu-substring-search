import WebpackDevServer from "webpack-dev-server";
import config from "./webpack.config";
import merge from "webpack-merge";
import webpack from "webpack";

export default merge<
  webpack.Configuration | { devServer: WebpackDevServer.Configuration }
>(config, {
  mode: "production",
});
