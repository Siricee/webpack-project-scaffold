# 基础 webpack 环境模板

这是一个仅做基础开发配置的 webpack 脚手架，不含各种框架，仅含基础前端开发流程所需工具。

## 支持特性

- 支持加载 css，但不含 css preprocessor
- 支持加载图片、字体等
- 支持 ES6
- 分离 css
- [生产模式] 压缩 JS、压缩 css
- [生产模式] build 命令自动清空输出目录

## 命令

```shell
npm run dev # 启动 HMR 调试
npm run build # 打包
npm run clean # 清空dist
```

## 参考链接

[从零开始配置 webpack(基于 webpack 4 和 babel 7 版本) - 掘金](https://juejin.cn/post/6844903802189905934)

<details>
<summary>展开归档</summary>

### 防丢归档

#### 1. 最简 webpack 配置

首先初始化 npm 和安装 webpack 的依赖:

```shell
npm init -y
npm install --save-dev webpack webpack-cli
```

复制代码配置 webpack.config.js 文件如下:

```js
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
};
```

说明: publicPath 上线时配置的是 cdn 的地址。

使用命令进行打包:

```
webpack --mode production
```

也可以将其配置到 package.json 中的 scripts 字段.

入口文件为 src/index.js, 打包输出到 dist/bundle.js.

#### 2. 使用模板 html

html-webpack-plugin 可以指定 template 模板文件，将会在 output 目录下，生成 html 文件，并引入打包后的 js.
安装依赖:

```
npm install --save-dev html-webpack-plugin
```

在 webpack.config.js 增加 plugins 配置:

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  //...other code
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
  ],
};
```

HtmlWebpackPlugin 还有一些其它的参数,如 title(html 的 title),minify(是否要压缩),filename(dist 中生成的 html 的文件名)等

#### 3. 配置 webpack-dev-server

webpack-dev-server 提供了一个简单的 Web 服务器和实时热更新的能力
安装依赖:

```
npm install --save-dev webpack-dev-server
```

在 webpack.config.js 增加 devServer 配置:

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  //...other code
  devServer: {
    contentBase: "./dist",
    port: "8080",
    host: "localhost",
  },
};
```

在 package.json 的 scripts 字段中增加:
webpack-dev-server --mode development
复制代码之后，我们就可以通过 npm run dev , 来启动服务。

#### 4. 支持加载 css 文件

通过使用不同的 style-loader 和 css-loader, 可以将 css 文件转换成 JS 文件类型。
安装依赖:

```
npm install --save-dev style-loader css-loader
```

在 webpack.config.js 中增加 loader 的配置。

```js
module.exports = {
  //other code
  module: {
    rules: [
      {
        test: /\.css/,
        use: ["style-loader", "css-loader"],
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
      },
    ],
  },
};
```

loader 可以配置以下参数:

test: 匹配处理文件的扩展名的正则表达式
use: loader 名称
include/exclude: 手动指定必须处理的文件夹或屏蔽不需要处理的文件夹
query: 为 loader 提供额外的设置选项

如果需要给 loader 传参，那么可以使用 use+loader 的方式,如:

```js
module.exports = {
  //other code
  module: {
    rules: [
      {
        use: [
          {
            loader: "style-loader",
            options: {
              insertAt: "top",
            },
          },
          "css-loader",
        ],
        //....
      },
    ],
  },
};
```

#### 5. 支持加载图片

- file-loader: 解决 CSS 等文件中的引入图片路径问题
- url-loader: 当图片小于 limit 的时候会把图片 Base64 编码，大于 limit 参数的时候还是使用 file-loader 进行拷贝

如果希望图片存放在单独的目录下，那么需要指定 outputPath
安装依赖:

```
npm install --save-dev url-loader file-loader
```

在 webpack.config.js 中增加 loader 的配置(增加在 module.rules 的数组中)。

```js
module.exports = {
  //other code
  module: {
    rules: [
      {
        test: /\.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              outputPath: "images",
            },
          },
        ],
      },
    ],
  },
};
```

#### 6. 支持编译 less 和 sass

有些前端同事可能习惯于使用 less 或者是 sass 编写 css，那么也需要在 webpack 中进行配置。
安装对应的依赖:

```
npm install --save-dev less less-loader
npm install --save-dev node-sass sass-loader
```

在 webpack.config.js 中增加 loader 的配置(module.rules 数组中)。

```
module.exports = {
    //other code
    module: {
        rules: [
            {
                test: /\.less/,
                use: ['style-loader', 'css-loader', 'less-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.scss/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            }
        ]
    }
}
```

#### 7. 支持转义 ES6/ES7/JSX

ES6/ES7/JSX 转义需要 Babel 的依赖，支持装饰器。

```
npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/plugin-proposal-decorators @babel/plugin-proposal-object-rest-spread
```

在 webpack.config.js 中增加 loader 的配置(module.rules 数组中)。

```js
module.exports = {
  //other code
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/react"],
              plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
              ],
            },
          },
        ],
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
      },
    ],
  },
};
```

#### 8. 压缩 JS 文件

安装依赖:

```
npm install --save-dev uglifyjs-webpack-plugin
```

在 webpack.config.js 中增加 optimization 的配置

```js
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  //other code
  optimization: {
    minimizer: [
      new UglifyWebpackPlugin({
        parallel: 4,
      }),
    ],
  },
};
```

#### 9. 分离 CSS(如果 CSS 文件较大的话)

因为 CSS 的下载和 JS 可以并行，当一个 HTML 文件很大的时候，可以把 CSS 单独提取出来加载

```
npm install --save-dev mini-css-extract-plugin
```

在 webpack.config.js 中增加 plugins 的配置,并且将 'style-loader' 修改为 { loader: MiniCssExtractPlugin.loader}。

CSS 打包在单独目录，那么配置 filename。

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //other code
  module: {
    rules: [
      {
        test: /\.css/,
        use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader"],
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
      },
      {
        test: /\.less/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          "less-loader",
        ],
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
      },
      {
        test: /\.scss/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          "sass-loader",
        ],
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
  ],
};
```

#### 10. 压缩 CSS 文件

安装依赖:
npm install --save-dev optimize-css-assets-webpack-plugin
复制代码在 webpack.config.js 中的 optimization 中增加配置

```js
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  //other code
  optimization: {
    minimizer: [new OptimizeCssAssetsWebpackPlugin()],
  },
};
```

#### 11. 打包前先清空输出目录

```
npm install --save-dev clean-webpack-plugin
```

在 webpack.config.js 中增加 plugins 的配置

```js
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  //other code
  plugins: [new CleanWebpackPlugin()],
};
```

</details>
