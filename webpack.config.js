const path = require('path')

//生产与开发环境区分
const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production'
const mode = isProduction ? 'production' : 'development'

//常用路径定义
const public = path.resolve(__dirname, 'public')
const dist = path.resolve(__dirname, 'dist')

//入口定义
const entryIndex = path.resolve(__dirname, 'src/app/index.tsx')
const entryServer = path.resolve(__dirname, 'src/server/server.ts')

//引入的插件列表
//HTMLWebpackPlugin's options
const HTMLWebpackPlugin = require('html-webpack-plugin')
const indexTemplate = path.resolve(public, 'index.html')
const favicon = path.resolve(public, 'favicon.ico')

//clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

//基础配置
const base = {
  mode: mode,
  context: path.resolve(__dirname),
  watch: true,
  devtool: 'source-map',
  devServer: {
    open: true,
    compress: true,
    contentBase: public,
    host: '0.0.0.0',
    port: 8080,
    watchContentBase: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'babel-loader'
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html?$/,
        use: [{
          loader: 'html-loader',
          options: { minimize: isProduction }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
}

//各环境区分配置
const configs = [
  {
    entry: { index: entryIndex },
    output: {
      filename: '[name].js',
      path: path.resolve(dist, 'app'),
      publicPath: '/'
    },
    plugins: [
      // new CleanWebpackPlugin(),
      new HTMLWebpackPlugin({
        template: indexTemplate,
        favicon: favicon,
        filename: 'index.html'
      })
    ]
  },
  {
    target: 'node',
    node: {
      __dirname: true,
      __filename: true
    },
    entry: { server: entryServer },
    output: {
      filename: '[name].js',
      path: path.resolve(dist, 'server'),
    },
    plugins: [
      // new CleanWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [{
            loader: 'babel-loader',
          }],
          exclude: /node_modules/,
        },
      ]
    },
    externals: [
      {
        formidable: 'commonjs formidable',
      },
    ],
  },
]

module.exports = configs.map(config => Object.assign({}, base, config))