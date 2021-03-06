const webpack = require("webpack");
const path = require("path");
module.exports = {
  devtool: "source-map",
  entry: {
    app: path.join(__dirname, "javascript", "app.js")
  },
  output: {
    path: path.join(__dirname, "public", "javascripts"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        include: [
          path.join(__dirname, "javascript")
        ],
        loaders: ["babel"]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
      // {
      //     test: /\.svg$/,
      //     loader: 'svg-inline'
      // }
    ]
  },
  resolve: {
    root: [
      path.resolve(path.join(__dirname, "javascript"))
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production' || 'development')
    }),
  ]
};