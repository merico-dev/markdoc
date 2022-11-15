---
{
  "title": "这里可以写文档标题",
  "desc": "这里是一个 JSON 格式的 Front Matter 示例，你可以附加任何有用的信息，用来指示文档的一些属性。如果你愿意，也可以使用 YAML 或 TOML 格式来编写 Front Matter，只要确保 Front Matter 的内容被包裹在了 --- 块之内，且 --- 块被放置在了 Markdown 文档开头即可。",
  "lang": "zh",
  "author": "张丁丁",
  "created_at": "2022-08-05",
  "updated_at": "2022-08-08",
  "edtion": "1",
  "tags": ["tag1", "tag2"],
  "about": "https://github.com/jonschlinkert/gray-matter"
}
---
# 初学者教程

这是一篇关于我们文档系统的初学者教程。基本上，我们的文档系统采用 Markdown 编写，然后在此基础上对 Markdown 的语法进行了一些扩展。

> 这里的「文档系统」包括帮助系统的文档和专家系统的文档。

## Markdown 简介

先来介绍介绍什么是 Markdown 以及我们文档系统所使用的 Markdown 规范。

[**Markdown**](https://zh.wikipedia.org/wiki/Markdown) 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档，然后转换成有效的 HTML 文档。由于 Markdown 的*轻量化*、*易读易写*特性，并且对于图片，图表都有支持，目前许多网站都广泛使用 Markdown 来撰写帮助文档或是用于论坛上发表消息。

![Markdown Logo](https://lovdin.com/images/markdown-57d3fd4.svg)

### 谁创建了 Markdown？

Markdown 最初由 John Gruber 和 Aaron Swartz 于 2004 年合作开发，Gruber 用 Perl 写了第一个 Markdown 到 HTML 的转换器，它很快就被广泛用于网站中。到 2014 年，已经有许多语言的数十种实现方式。

### 什么是 CommonMark 规范以及我们为什么需要 CommonMark 规范

John Gruber 对 Markdown 语法的描述并没有明确地指定清晰的规范。在没有规范的情况下，早期的实现者参考了原始 `Markdown.pl` 代码来解决这些歧义。但是 `Markdown.pl` 本身有很多错误，并且在很多情况下给出了明显糟糕的结果，所以它不是一个令人满意的规范替代品。`Markdown.pl` 最后更新于 2004 年 12 月 17 日。

因为没有明确的规范，在过去的十年中，对 Markdown 的解析出现了非常多的差异。结果，用户经常惊讶地发现，在某个系统上以一种方式呈现的文档在另一个系统上的呈现方式却并不相同。更糟糕的是，由于 Markdown 中没有任何东西可以算作是“语法错误”，所以这种差异往往不会被立即发现。

有鉴于此，一些“来自 GitHub、Reddit、Stack Exchange 以及开源社区的重要代表”组成了一个“小型非公开工作组”，打算将 Markdown 标准化，并为了进一步的改进开放该标准，其结果就是现在所说的 **CommonMark**。

CommonMark 为 Markdown 提出了一个标准的、明确的语法规范，以及一套综合测试来验证 Markdown 实现是否符合该规范，这对于 Markdown 的未来是必要的，甚至是必不可少的。

> 关于该规范为什么不叫作 Common Markdown 或者是 Standard Markdown，这里还有一段趣事，有兴趣的话可以点击[这里](https://www.infoq.cn/article/2014/09/markdown-commonmark)查看。

在 CommonMark 的基础上，GitHub 根据自己的需求基于 CommonMark 做了一些扩展，这个规范通常被叫做 `GFM`，亦即 `GitHub Flavored Markdown`。GFM 也非常流行，大部分 Markdown 编辑器都支持 GFM 风格的 Markdown 语法。事实上，我们的文档系统也推荐使用 GFM 规范来编写基本的 Markdown 的文档（当然，在 GFM 的基础之上我们还做了一些扩展，这个稍候再叙）。关于 GFM 风格的 Markdown 语法学习，可以参见 GitHub 的官方文档：[在 GitHub 上编写——基本撰写和格式语法](https://docs.github.com/cn/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)，我们这里就不赘述了。

## 文档系统设计

我们的文档系统在 GFM 的基础上进行了扩展，添加了文档元信息、支持自定义标题与段落的 ID 和关键字、自定义样式等功能。

> 严格来说，这些扩展语法已经不属于 Markdown 语法的范畴了，而是对 Markdown 编译过程中或编译后的产物进行了扩展。

### Front Matter

Front Matter，扉页，即书本翻开以后的第一页。在 Markdown 中，Front Matter 指文档最开头的信息。Front Matter 必须是 Markdown 文件中的第一部分，且内容必须为在三点划线 `---` 之间书写的有效的 YAML/JSON/TOML，例如下面是一个采用 JSON 格式书写的 Front Matter 示例：

```plaintext
---
{
  "title": "海边的曼彻斯特",
  "imdb": "tt4034228"
}
---
```

这部分信息不会出现在 Markdown 编译后的 HTML 文件中，仅用做提供文档元信息。

> 关于 YAML/JSON/TOML 的语法规范这里不做过多阐述，请自行查阅相关的语法规范文档。

### 向标题和段落中添加自定义 ID

标题和段落支持加入自定义 ID，该 ID 会赋给编译后对应的 HTML 元素。语法规则为使用 `{[:` 和 `]}` 括起来的一串字符，字符串的命名应该遵循以下规则：

- 字符仅支持：`英文字母`/`数字`/`-`/`_`
- 必须以英文字母打头

> 例如 `tt4034228` 就是一个有效的 ID，而 `4034228tt` 则不是。

例如下面的 Markdown 文档：

```plaintext
{[:tt4034228]}《海边的曼彻斯特》是肯尼斯·罗纳根执导的剧情片，于 2016 年 11 月 18 日在美国上映。
```

会被编译为：

```html
<p id="tt4034228">《海边的曼彻斯特》是肯尼斯·罗纳根执导的剧情片，于 2016 年 11 月 18 日在美国上映。</p>
```

> 注意：`{` `[` `:` `]` `}` 这些字符被用来做**语法解析**，均为**半角字符**，请勿使用全角字符。事实上，凡是被当作语法解析的符号，请全部使用半角字符。比如 Markdown 语法字符、HTML 语法字符、JSON 语法字符、我们自定义语法的字符等等，都应该使用英文半角字符。

另外，有一些地方要注意：

一、一个标题/段落只支持设置一次 ID，多余的设置会被丢掉，以第一个设置为准。

例如：

```plaintext
{[:tt4034228]}《海边的曼彻斯特》{[:manchester-by-the-sea]}是肯尼斯·罗纳根执导的剧情片，于 2016 年 11 月 18 日在美国上映。
```

会被编译为：

```html
<p id="tt4034228">《海边的曼彻斯特》是肯尼斯·罗纳根执导的剧情片，于 2016 年 11 月 18 日在美国上映。</p>
```

`manchester-by-the-sea` 会被丢掉。

二、一篇文档内的 ID 不应该重复（这很好理解，否则也就不能称之为 ID 了）。

### 向标题和段落中添加自定义关键字

标题和段落还支持加入自定义的 Keywords，用于表示该元素的一些附加属性，该 Keywords 会赋给编译后对应的 HTML 元素。语法规则为使用 `{[;` 和 `]}` 括起来的一串字符。自定义关键字支持一次赋予多个 Keyword，不同的 Keyword 字符串之间以*空格*分割。单个 Keyword 字符串的命名规则同 ID 的命名规则。

例如下面的 Markdown 文档：

```plaintext
{[;Casey_Affleck Lucas_Hedges Kyle_Chandler Michelle_Williams]}《海边的曼彻斯特》由卡西·阿弗莱克、卢卡斯·赫奇斯、凯尔·钱德勒、米歇尔·威廉姆斯等主演。
```

会被编译为：

```html
<p data-keywords="Casey_Affleck Lucas_Hedges Kyle_Chandler Michelle_Williams">《海边的曼彻斯特》由卡西·阿弗莱克、卢卡斯·赫奇斯、凯尔·钱德勒、米歇尔·威廉姆斯等主演。</p>
```

有一点需要注意：一个标题/段落只支持设置一次 Keywords（但是如上面的例子所示，你一次可以设置多个 Keyword）。

### 变量占位符

标题和段落还支持加入自定义的变量占位符，用于在渲染文档时使用实际的变量数值来替换。语法规则为使用 `{[@` 和 `]}` 括起来的一串字符，字符串的命名应该遵循以下规则：

- 字符仅支持：`英文字母`/`数字`/`_`
- 必须以英文字母打头

该功能的主要目的在于支持将来的数值替换（例如专家系统可能会有此需求），需要配合对应的前端代码使用，请消费者自行解析。

### 样式

目前使用我们自己的 `npm run parse` 命令编译 Markdown，生成的 HTML 文档会内置 [GitHub Markdown 的样式](https://github.com/sindresorhus/github-markdown-css/blob/main/github-markdown-light.css)，如果有需要，将来可以换成我们自己的样式。

### 代码高亮

目前使用我们自己的 `npm run parse` 命令编译 Markdown，生成的 HTML 文档会内置 [GitHub Markdown 的代码高亮样式](https://github.com/highlightjs/highlight.js/blob/main/src/styles/github.css)，如果有需要，可以替换为我们自己的代码高亮样式或者删除代码高亮功能。

### 文档分块

如果将来文档有分块展示的需求，还可以使用内置的 HTML 代码块包裹起来，方便文档的展示与折叠。例如：

```markdown
<div data-section="synopsis">
## 剧情简介

李（Casey Affleck 饰）是一名颓废压抑的修理工，在得知哥哥乔（Kyle Chandler 饰）去世的消息后，李回到了故乡...
</div>
```

> 我们约定对于分块展示的标识属性为 `data-section`，`data-section` 属性的值同一文档内唯一，命名遵循自定义 ID 的命名规则（比如这里的 `synopsis` 就是一个合法的命名）。

### 其他

如果在文档中要引用图片等静态资源，请先将图片上传到我们自己的图床（图片存储服务器），然后在文档中引用该图片的地址。

## 参考资料

- [Markdown Wiki](https://zh.wikipedia.org/wiki/Markdown)
- [CommonMark](https://commonmark.org/)
- [Markdown 的标准化之路](https://www.infoq.cn/article/2014/09/markdown-commonmark)
- [CommonMark: A Formal Specification For Markdown](https://www.smashingmagazine.com/2020/12/commonmark-formal-specification-markdown/)
- [A formal spec for GitHub Flavored Markdown](https://github.blog/2017-03-14-a-formal-spec-for-github-markdown/)
- [在 GitHub 上编写——基本撰写和格式语法](https://docs.github.com/cn/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
