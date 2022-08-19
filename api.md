# API

API 解释说明。

### `POST` api/v1/docs

**描述**

根据指定条件批量获取文档。

**参数**

```
[
  {
    "lang": "zh",
    "key": "test",
    "sections": [
      "awards"
    ]
  }
]
```

- `lang` 表示要获取的文档的语言，目前支持 `zh`/`en` 两种。
- `key` 表示要获取的文档的唯一标识符，这个 `key` 要和文档的文件名一致。
- `sections` 可选参数，表示要获取文档的哪几部分，这里的 `section` 要和制定文档中的 `data-section` 属性一致。如果 `sections` 为空，则表示获取整篇文档。

**返回值**

```json
[
  {
    "criterion": {
      "lang": "zh",
      "key": "test",
      "sections": [
        "awards"
      ]
    },
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
- `info` 表示文档信息，这部分数据来源于 Markdown 文档的 Front Matter 数据。
- `data` 表示文档内容。