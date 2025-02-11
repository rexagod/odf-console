/* eslint-env node */

import * as path from 'path';
import { ConsoleRemotePlugin } from '@openshift-console/dynamic-plugin-sdk-webpack';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as webpack from 'webpack';

const LANGUAGES = ['en', 'ja', 'ko', 'zh'];
const resolveLocale = (dirName: string, ns: string) =>
  LANGUAGES.reduce(
    (acc, lang) => [
      ...acc,
      {
        from: path.resolve(dirName, `locales/${lang}/plugin__*.json`),
        to: `locales/${lang}/${ns}.[ext]`,
      },
    ],
    []
  );

const config: webpack.Configuration = {
  mode: 'development',
  entry: {},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js',
    chunkFilename: '[name]-chunk.js',
  },
  watchOptions: {
    ignored: ['node_modules', 'dist'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9001,
    writeToDisk: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /(\.jsx?)|(\.tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        include: [
          /node_modules\/@openshift-console\/plugin-shared/,
          /packages/,
        ],
        use: [
          { loader: 'cache-loader' },
          { loader: 'thread-loader' },
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              outputStyle: 'compressed',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new ConsoleRemotePlugin(),
    new CopyWebpackPlugin({
      patterns: [...resolveLocale(__dirname, process.env.I8N_NS)],
    }),
    new webpack.DefinePlugin({
      'process.env.MODE': JSON.stringify(process.env.MODE),
    }),
    new webpack.DefinePlugin({
      'process.env.I8N_NS': JSON.stringify(process.env.I8N_NS),
    }),
  ],
  devtool: 'cheap-module-source-map',
  optimization: {
    chunkIds: 'named',
    minimize: false,
  },
};

export default config;
