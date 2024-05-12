const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const deps = require("./package.json").dependencies;

const configs = {
  appName: "app1",
  appFileName: "remoteEntry.js",
  development: {
    PUBLIC_PATH: "http://localhost:4000/",
    REMOTES: ["app2@http://localhost:4001/remoteEntry.js"],
    PORT: 4000,
  },
  production: {
    PUBLIC_PATH: "http://localhost:4000/",
    REMOTES: ["app2@http://localhost:4001/remoteEntry.js"],
    PORT: 4000,
  },
};

module.exports = (env, argv) => {
  console.log({ env, argv, configs: configs[argv.mode] });

  const { appName, appFileName } = configs;
  const { PUBLIC_PATH, PORT, REMOTES } = configs[argv.mode];

  let _remotes = {};
  for (let i = 0; i < REMOTES.length; i++) {
    _remotes[REMOTES[i].split("@")[0]] = REMOTES[i];
  }

  return {
    output: {
      publicPath: PUBLIC_PATH,
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },

    devServer: {
      hot: true,
      port: PORT,
      historyApiFallback: true,
    },

    module: {
      rules: [
        {
          test: /\.m?js/,
          type: "javascript/auto",
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        name: appName,
        filename: appFileName,
        remotes: _remotes,
        exposes: {
          "./header": "./src/components/Header/index.jsx",
        },
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new Dotenv(),
    ],
  };
};
