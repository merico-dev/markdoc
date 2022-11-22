# API

API 解释说明。

---

### `GET` api/v2/version

**描述**

获取服务器代码的版本信息。

**请求参数**

无

**返回值**

```json
{
  "packageVersion": "2.1.0",
  "buildVersion": "v2.1.0",
  "buildHash": "07f275d35f95d9e2ed11edec4447811163ca66de",
  "docsVersionInfo": {
    "tutorialHash": "abc03519a503df0d3a7d47d4032e55be4a087123",
    "helpHash": "def03519a503df0d3a7d47d4032e55be4a087456"
  }
}
```

- `packageVersion` 表示 NPM 软件包版本号，该值来源于 `package.json` 中的 `version` 字段。
- `buildVersion` 表示构建代码的（可读）版本号，该值来源于启动服务器时传入的 `BUILD_VERSION` 环境变量。若启动时未传入 `BUILD_VERSION` 环境变量，则该值为 `undefined`。
- `buildHash` 表示构建代码所对应的提交哈希值，该值来源于启动服务器时传入的 `BUILD_HASH` 环境变量。若启动时未传入 `BUILD_HASH` 环境变量，则该值为 `undefined`。
- `docsVersionInfo` 表示文档源版本信息，如果服务器启动时没有传入任何文档源，则该值为 `undefined`。如果启动时传入了文档源，则文档源的版本信息会附加到该字段，例如服务器启动时传入了 `tutorial` 和 `help` 两个文档源，那么 `docsVersionInfo` 下则会有 `tutorialHash` 和 `helpHash` 两个字段，分别表示两个文档源对应的提交哈希值。

---

### `POST` api/v2/docs

**描述**

根据指定条件批量获取文档。

**请求参数**

```json
[
  {
    "source": "tutorial",
    "lang": "zh",
    "file": "test",
    "options": {
      "edition": 3,
      "sections": [
        "awards"
      ]
    }
  }
]
```

- `source` 表示要获取的文档来自于哪个文档源，这个 `source` 即是某个文档源的配置信息（`md.yaml`）中的 `key` 字段的值。
- `lang` 表示要获取的文档的语言。
- `file` 表示要获取的文档的标识符，这个 `file` 即是文档的文件名。
- `options` 可选参数，字段如下：
  - `edition` 表示要获取的文档的版本，如果传入了 `edition`，则 `edition` 必须为正整数（且小于 2^53）。
  - `sections` 表示要获取文档的哪几部分，这里的 `section` 要和制定文档中的 `data-section` 属性一致。如果不传 `sections` 或 `sections` 为空数组，则表示获取整篇文档。

**返回值**

```json
[
  {
    "criterion": {
      "source": "tutorial",
      "lang": "zh",
      "file": "test",
      "options": {
        "edition": 3,
        "sections": [
          "awards"
        ]
      }
    },
    "sourceHash": "07f275d35f95d9e2ed11edec4447811163ca66de",
    "lang": "zh",
    "edition": 3,
    "info": {
      "title": "海边的曼彻斯特",
      "desc": "影片讲述了李·钱德勒的哥哥因病去世之后，他作为监护人照顾侄子的故事",
      "imdb": "tt4034228",
      "director": "Kenneth Lonergan",
      "release": "2016-11-18",
      "about": "https://movie.douban.com/subject/25980443/"
    },
    "data": [
      "<div data-section=\"awards\"><h2>奖项</h2><p>电影于 2016 年 1 月 23 日的圣丹斯电影节上首映后，很快被亚马逊工作室（Amazon Studios）分发，并订于 2016 年 11 月 18 日于美国作有限上映，并定于 12 月 16 日广泛上映。该片以 850 万美元的制作预算，全球收益总得超过 6200 万美元。</p><p>影片上映后获得一致好评，并赢得无数奖项。这部电影被许多评论家列为 2016 年最佳电影之一，获得第 89 届奥斯卡金像奖最佳男主角、最佳原创剧本，第 74 届金球奖最佳男主角奖，第 70 届英国电影学院奖最佳男主角和最佳原创剧本。</p></div>"
    ]
  }
]
```

- `criterion` 表示请求信息。
- `sourceHash` 表示文档源版本的提交哈希值，如果文档源没有版本哈希值，则返回 `null`。
- `lang` 表示文档语言。
- `edition` 表示文档版本，如果文档没有版本，则返回 `null`。
- `info` 表示文档信息，这部分数据来源于 Markdown 文档的 Front Matter 数据。
- `data` 表示文档内容。
