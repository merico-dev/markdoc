---
{
  "title": "Here you can write the title of the document",
  "desc": "这些关于 Front Matter 的文字我懒得翻译为英文了，同时也是想告诉你，这里的信息只是文档的属性信息，并不会呈现在最后生成的文档内容之中。",
  "lang": "en",
  "author": "张丁丁",
  "created_at": "2022-08-05",
  "updated_at": "2022-08-08",
  "edition": "1",
  "tags": ["tag1", "tag2"],
  "about": "https://github.com/jonschlinkert/gray-matter"
}
---
# Tutorial for beginners

This is a tutorial for beginners about our documentation system. Basically, our documentation system is written in Markdown, and then some extensions are made to the Markdown syntax on top of that.

> The "documentation system" here includes the documentation of the help system and the documentation of the expert system.

## Markdown

Let's start with an introduction to what Markdown is and the Markdown specification used by our documentation system.

[**Markdown**](https://en.wikipedia.org/wiki/Markdown) is a lightweight markup language for creating formatted text using a plain-text editor. Markdown is widely used in blogging, instant messaging, online forums, collaborative software, documentation pages, and readme files.

![Markdown Logo](https://lovdin.com/images/markdown-57d3fd4.svg)

### Who created Markdown?

It was developed in 2004 by John Gruber in collaboration with Aaron Swartz. Gruber wrote the first markdown-to-html converter in Perl, and it soon became widely used in websites. By 2014 there were dozens of implementations in many languages.

### What is CommonMark and why is CommonMark needed?

John Gruber’s canonical description of Markdown’s syntax does not specify the syntax unambiguously. In the absence of a spec, early implementers consulted the original `Markdown.pl` code to resolve these ambiguities. But `Markdown.pl` was quite buggy, and gave manifestly bad results in many cases, so it was not a satisfactory replacement for a spec. `Markdown.pl` was last updated December 17th, 2004.

Because there is no unambiguous spec, implementations have diverged considerably over the last 10 years. As a result, users are often surprised to find that a document that renders one way on one system renders differently on another. To make matters worse, because nothing in Markdown counts as a "syntax error", the divergence often isn’t discovered right away.

Thus, one of those looking to improve Markdown is Jeff Atwood, co-founder of the Stack Exchange network, including StackOverflow. According to Atwood, a number of "key representatives from GitHub, from Reddit, from Stack Exchange, from the open source community" formed a "small private working group" intending to standardize Markdown, and open it for further enhancements. The result is what is now known as **CommonMark**.

CommonMark propose a standard, unambiguous syntax specification for Markdown, along with a suite of comprehensive tests to validate Markdown implementations against this specification. CommonMark believe this is necessary, even essential, for the future of Markdown.

> There is an interesting story about why the specification is not called Common Markdown or Standard Markdown, which can be viewed [here](https://www.infoq.com/news/2014/09/markdown-commonmark/) if you are interested.

Based on CommonMark, GitHub has made some extensions based on CommonMark according to its own needs, and this specification is often called `GFM`, or `GitHub Flavored Markdown`. GFM is also very popular, and most Markdown editors support GFM syntax. In fact, our documentation system recommends using the GFM specification to write basic Markdown documents (Of course, we have made some extensions to GFM, which we will talk about later). You can learn GFM syntax from the official GitHub documentation: [Writing on GitHub - Basic writing and formatting syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax), we won't go into details here.

## Design of documentation system

Our document system extends GFM with document meta information, support custom attributes for headings and paragraph, support custom styles, and more.

> Technically, these extended syntaxes are no longer part of the Markdown syntax, but rather extend the product of the Markdown compilation process or post-compilation.

### Front Matter

Front Matter, the first page of a book after it is opened. In Markdown, Front Matter refers to the information at the very beginning of a document. The Front Matter must be the first part of the Markdown file and must be a valid YAML/JSON/TOML written between the `---`, for example, the following is a Front Matter written in JSON example:

```plaintext
---
{
  "title": "Manchester by the Sea",
  "imdb": "tt4034228"
}
---
```

These information do not appear in the HTML compiled by Markdown and is only used to provide document meta information.

> The syntax specification of YAML/JSON/TOML is not too much elaborated here, please check the relevant syntax specification document by yourself.

### Add custom ID to headings and paragraph

Headings and paragraph support the inclusion of a custom ID that is assigned to the compiled HTML element. The syntax rule is a string of characters enclosed in `{[:` and `]}`, and the naming of the string should follow the following rules:

- You should only use: `a-z`/`A-Z`/`0-9`/`-`/`_`
- Must start with `a-z` or `A-Z`

> For example, `tt4034228` is a valid ID, while `4034228tt` is not.

For example, the following Markdown document:

```plaintext
{[:tt4034228]}Manchester by the Sea, a psychological drama film directed by Kenneth Lonergan, was released in the U.S. on November 18, 2016.
```

will be compiled as:

```html
<p id="tt4034228">Manchester by the Sea, a psychological drama film directed by Kenneth Lonergan, was released in the U.S. on November 18, 2016.</p>
```

> Note: Characters like `{` `[` `:` `]` `}`, these characters are used for **syntactic parsing** and are all **halfwidth forms**, do not use fullwidth forms. In fact, please use halfwidth forms when characters were used for syntactic parsing. For example, Markdown syntax characters, HTML syntax characters, JSON syntax characters, characters from our custom syntax, etc., should all use halfwidth forms.

In addition, there are some areas to note:

I. A heading/paragraph only supports setting ID once, extra settings will be discarded and the first setting will prevail.

For example:

```plaintext
{[:tt4034228]}Manchester by the Sea{[:manchester-by-the-sea]}, a psychological drama film directed by Kenneth Lonergan, was released in the U.S. on November 18, 2016.
```

will be compiled as:

```html
<p id="tt4034228">Manchester by the Sea, a psychological drama film directed by Kenneth Lonergan, was released in the U.S. on November 18, 2016.</p>
```

`manchester-by-the-sea` will be dropped.

II. The ID list in a document should not repeat (this is well understood, otherwise it would not be called ID ).

### Add custom keywords to headings and paragraph

Headings and paragraph also support the inclusion of custom keywords to indicate some additional attributes of the element, which is assigned to the compiled HTML element. The syntax rule is a string of characters enclosed in `{[;` and `]}`. Custom attributes can be assigned to multiple keywords at once, with the different keyword string separated by *space*. The naming convention for individual keyword is the same as that for ID.

For example, the following Markdown document:

```plaintext
{[;Casey_Affleck Lucas_Hedges Kyle_Chandler Michelle_Williams]}Manchester by the Sea stars Casey Affleck, Kyle Chandler, Lucas Hedges, Michelle Williams and more.
```

will be compiled as:

```html
<p data-keywords="Casey_Affleck Lucas_Hedges Kyle_Chandler Michelle_Williams">Manchester by the Sea stars Casey Affleck, Kyle Chandler, Lucas Hedges, Michelle Williams and more.</p>
```

One thing to note: a heading/paragraph only supports setting keywords once (but as the example above shows, you can set more than one keyword at a time).

### Variable placeholder

Headings and paragraph also support the inclusion of custom variable placeholders that are used to replace the actual variable values when rendering the document. The syntax rule is a string of characters enclosed using `{[@` and `]}`, and the naming of the string should follow the following rules.

- You should only use: `a-z`/`A-Z`/`0-9`/`_`
- Must start with `a-z` or `A-Z`

The main purpose of this feature is to support the potential need for value replacement, which needs to be used with the corresponding parsing code, so consumers should parse it themselves.

### Style

Currently, using our own `npm run parse` to compile Markdown, the generated HTML document will have [GitHub Markdown Styles](https://github.com/sindresorhus/github-markdown-css/blob/main/github-markdown-light.css) built in, but you can switch to our own styles in the future.

### Code highlighting

Currently, using our own `npm run parse` to compile Markdown, the generated HTML document will have [GitHub Markdown's code highlighting styles](https://github.com/highlightjs/highlight.js/blob/main/src/styles/github.css) built in, but you can switch to our own code highlighting styles or remove code highlighting if needed.

### Document fragments and custom HTML attributes

If the document has the need to be displayed in fragments in the future, you can also use the built-in HTML code block wrapped up to facilitate the display and collapse of the document content. For example:

```markdown
<div data-section="synopsis">

## Plot synopsis

Lee (Casey Affleck) is a decrepit and depressed repairman, after learning of the death of his brother Joe (Kyle Chandler), Lee returned to his hometown...

</div>
```

The identification name of a document block can be represented by the `data-<attr>` attribute within the HTML code block, and the naming of the `<attr>` should follow the following rules:

- You should only use: `a-z`/`-`
- Must start and end with `a-z` (and can NOT start with `xml`, it's a HTML rule)
- Multiple hyphens cannot be connected

For example, `data-section` here is a legal attribute; `data--section` or `data-section2` or `data-sectionB` are not legal attributes.

The naming of attribute value follows the above naming rules of custom ID, for example, `synopsis` is a legal name here.

> In fact, our document server has a built-in service for parsing the `data-section` attribute. As long as the `options.sections` attribute is set in the request parameters, the server will return the corresponding document sections when processing the document, as described in the API documentation. One thing to note is that the value of the `data-section` attribute should ideally be unique within the same document; even if the same `data-section` attribute value is set for multiple document fragments, the server will only return the first document fragment in which the attribute value of the `data-section` occurred.

### Others

If you want to reference a static resource such as an image in a document, please upload the image to our own image hosting server first, and then reference the address of that image in the document.

## Reference

- [Markdown Wiki](https://en.wikipedia.org/wiki/Markdown)
- [CommonMark](https://commonmark.org/)
- [Standard Markdown Becomes Common Markdown then CommonMark](https://www.infoq.com/news/2014/09/markdown-commonmark/)
- [CommonMark: A Formal Specification For Markdown](https://www.smashingmagazine.com/2020/12/commonmark-formal-specification-markdown/)
- [A formal spec for GitHub Flavored Markdown](https://github.blog/2017-03-14-a-formal-spec-for-github-markdown/)
- [Writing on GitHub - Basic writing and formatting syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
- [Using HTML data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes)
- [HTML data-* global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*)
