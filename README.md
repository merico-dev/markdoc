# EE Metric Help Doc

这里是我们的文档系统仓库。

> 这里的「文档系统」包括「帮助系统」的文档和「专家系统」的文档。

我们的文档采用 Markdown 编写，然后提供了 Markdown 编译为 HTML 的功能，还提供了 HTTP API 来响应文档信息及文档内容。

## 上手

如果你要「编译文档」或者「启动文档服务器」，以下是先决条件：

- Node.JS >= 14.19
- 拉取完本仓库之后请在根目录执行 `npm install`

如果只是「编写文档」，则无需这么麻烦，有一个文本编辑器就可以了。

### 如何编写文档？

基本上，我们的文档采用 Markdown 编写，然后在此基础上对 Markdown 的语法进行了一些扩展。关于文档的语法规范设计请见 [初学者教程](./md/zh/tutorial.md) 或者 [Tutorial for beginners](./md/en/tutorial.md)。

编写好 Markdown 文档后，根据不同的语言，将文档放置在 `md/zh/` 或 `md/en/` 目录下即可。有一点需要注意，Markdown 文档的命名须遵循以下规则：

- 文件名字符仅支持 `小写英文字母`/`数字`/`-`
- 文件名必须以小写英文字母打头
- 文档格式的后缀为 `.md`

> 特别的，我们还支持在文件名中使用 `@ 字符后跟数字` 来表示文档版本，例如 `sample-doc-2022@3.md` 就是一个合法的、完整的文件名，语义上来说表示 `sample-doc-2022` 第 `3` 版文档，文档格式为 Markdown。
>
> 关于这里我们有必要多说一些：首先，如果使用了 `@` 字符，那么 `@` 后面必须紧跟一个正整数（1、2、3...）；其次，版本信息必须是文件名（除后缀外）的最后一部分，且只出现一次，亦即在版本信息之后必须为 `.md` 后缀。例如，`sample2022@3.md` 是一个合法的、完整的文件名，而 `sample2022@.md` / `sample2022@doc.md` / `sample2022@3doc.md` / `sample2022@3.14.md` / `sample2022@3@4.md` 都是不合法的。最后，从语义上来说，版本为 1 的文档与没有版本的文档不是一回事，例如 `sample2022.md` 与 `sample2022@1.md` 不是一回事，可以理解为 `sample2022.md` 是一篇通用的文档，而 `sample2022@1.md` 是一篇特定版本的文档。
>
> 另外，关于文档版本化的最佳实践是“不要使用文档版本”，如果文档有一些错别字需要修正或内容需要完善，这些通常不需要另建一个版本，在原文档上修改即可，只有当新内容作出了重大不兼容的改变且新旧内容均需保留的情况下，才有必要建立一个新版本的文档。

### 如何编译文档并预览？

如果想查看 Markdown 转换后的 HTML 文档效果，可以运行以下命令：

```sh
npm run parse
```

该命令会在 `public/docs/` 下生成对应的 HTML 文档，使用浏览器打开 HTML 文档即可预览。

### 如何启动一个 HTTP Server 来提供文档？

你也可以启动一个 Server 来通过 HTTP 协议向外提供文档，该 Server 会直接读取 Markdown 文档，然后按照指定参数返回文档信息和编译好的 HTML 内容（或内容片段）。

首先在根目录创建一个 `.env` 的环境变量配置：

```
SERVER_HOST="localhost"
SERVER_PORT=3000
```

> `SERVER_HOST` 和 `SERVER_PORT` 请根据你自己的实际情况来配置。当然，直接使用命令行来传入环境变量也是可以的。如果你没有配置环境变量，服务器会默认使用 `localhost:3000` 来启动。

然后运行如下命令：

```sh
npm run serve
```

即可启动文档服务器。

> 你也可以在启动服务器时传入 `BUILD_VERSION` 和 `BUILD_HASH` 环境变量（或构建时动态写入到 `.env` 中），这样你可以通过相关 API 来获取服务器运行/构建时的版本信息。

服务器 API 可参见 [API](./api.md)。
