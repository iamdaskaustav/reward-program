const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "bundle.[fullhash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  // resolve: {
  //   modules: [__dirname, "src", "node_modules"],
  //   extensions: [".*", ".js", ".jsx", ".tsx", ".ts"],
  // },
  devServer: {
    static: "./dist",
    port: 8080,
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // Regex for image types
        use: [
          {
            loader: "file-loader",
            options: {
              name: "images/[name].[hash].[ext]", // Output file naming
            },
          },
        ],
      },
    ],
  },
};
