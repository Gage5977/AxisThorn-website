const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: './src/js/main.js',
    invoices: './src/js/invoices.js',
    'axis-ai': './src/js/axis-ai.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/invoices.html',
      filename: 'invoices.html',
      chunks: ['invoices']
    }),
    new HtmlWebpackPlugin({
      template: './src/banking.html',
      filename: 'banking.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/banking-portal.html',
      filename: 'banking-portal.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/axis-ai.html',
      filename: 'axis-ai.html',
      chunks: ['axis-ai']
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets/images/favicon.svg', to: 'favicon.svg' },
        { from: 'src/assets/images/logo.svg', to: 'logo.svg' },
        { from: 'src/assets/images/logo-modern-v1.svg', to: 'logo-modern-v1.svg' },
        { from: 'src/assets/images/logo-modern-v2.svg', to: 'logo-modern-v2.svg' },
        { from: 'src/assets/images/logo-modern-v3.svg', to: 'logo-modern-v3.svg' },
        { from: 'src/site.webmanifest', to: 'site.webmanifest' },
        { from: 'api', to: 'api' }
      ]
    })
  ],
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true
  }
};