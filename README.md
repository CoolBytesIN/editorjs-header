# Header block tool for Editor.js

This [Editor.js](https://editorjs.io/) block tool extends [@editorjs/header](https://github.com/editor-js/header) to include alignment options (see [Preview](https://github.com/CoolBytesIN/editorjs-header?tab=readme-ov-file#preview)).

## Preview

#### Block Tool
![header](https://api.coolbytes.in/media/handle/view/image/300/)

#### Block Settings
![settings](https://api.coolbytes.in/media/handle/view/image/301/)

## Installation

**Using `npm`**

```sh
npm install @coolbytes/editorjs-header
```

**Using `yarn`**

```sh
yarn add @coolbytes/editorjs-header
```

## Usage

Include it in the `tools` property of Editor.js config:

```js
const editor = new EditorJS({
  tools: {
    header: Header
  }
});
```

## Config Params

|Field|Type|Optional|Default|Description|
|---|---|---|---|---|
|placeholder|`string`|`Yes`|''|Placeholder text when empty|
|levels|`number[]`|`Yes`|[1, 2, 3, 4, 5, 6]|All supported header levels|
|defaultLevel|`number`|`Yes`|1|Preferred header level|
|alignTypes|`string[]`|`Yes`|['left', 'center', 'right', 'justify']|All supported alignment options|
|defaultAlignType|`string`|`Yes`|'left'|Preferred alignment type|

&nbsp;

```js
const editor = EditorJS({
  tools: {
    header: {
      class: Header,
      config: {
        placeholder: 'Start Typing...',
        levels: [1, 2, 3, 4, 5, 6],
        defaultLevel: 1,
        alignTypes: ['left', 'center', 'right', 'justify'],
        defaultAlignType: 'left'
      }
    }
  }
});
```

## Output data

|Field|Type|Description|
|---|---|---|
|text|`string`|Header's text|
|level|`number`|Header level|
|align|`string`|Alignment type|

&nbsp;

Example:

```json
{
  "time": 1715969561758,
  "blocks": [
    {
      "id": "_K5QcJHHuK",
      "type": "header",
      "data": {
        "text": "Cool Bytes",
        "level": 1,
        "align": "center"
      }
    }
  ],
  "version": "2.29.1"
}
```