import path from "path";
import { UserscriptPlugin } from "webpack-userscript";
import metadata from "./metadata.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      {
        test: /\.scss$/,
        use: [
          "style-loader", // Injects CSS into the DOM
          "css-loader", // Interprets @import and url() like import/require()
          "sass-loader", // Loads and compiles SCSS files
        ],
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
