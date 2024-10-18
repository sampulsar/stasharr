import path from "path";
import { UserscriptPlugin } from "webpack-userscript";
import metadata from "./metadata";

export default {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "stasherr.user.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new UserscriptPlugin({
      headers: metadata,
    }),
  ],
};
