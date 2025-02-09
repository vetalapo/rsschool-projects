const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");
const ESLintPlugin = require("eslint-webpack-plugin");

const baseConfig = {
    entry: path.resolve(__dirname, "./src/index.ts"),
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg)$/i,
                type: "asset"
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./dist"),
        assetModuleFilename: "assets/[name][ext]"
    },
    plugins: [
        new ESLintPlugin({ extensions: "ts", failOnWarning: true }),
        new DotenvWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/index.html"),
            filename: "index.html",
            favicon: "./src/assets/favicon.ico"
        }),
        new CleanWebpackPlugin()
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === "prod";
    const envConfig = isProductionMode ? require("./webpack.prod.config") : require("./webpack.dev.config");

    return merge(baseConfig, envConfig);
};
