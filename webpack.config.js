const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const BASENAME = `/${(process.env.GITHUB_REPOSITORY || "").split('/').pop()}`

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
    publicPath: BASENAME
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        use: 'html-loader'
      },
      {
        test: /\.(?:js|mjs|cjs|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // compress: true,
    // hot: true,
    port: 9000,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html")
    }),
    new webpack.DefinePlugin({
      BASENAME: JSON.stringify(BASENAME)
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
