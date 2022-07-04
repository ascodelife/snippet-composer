# snippet-composer

A library is used to compose your snippets.

See this [article](https://github.com/ascodelife/snippet-composer/blob/master/doc/snippet-composer%EF%BC%9A%E7%BB%99%E4%BB%A3%E7%A0%81%E7%89%87%E6%AE%B5%E5%8A%A0%E7%82%B9%E9%AD%94%E6%B3%95.md) for details.


## 📦Installation

```bash
npm i snippet-composer -g
```

​	                      or

```bash
npm i snippet-composer -D
```

## 🤔Why use it

In vscode or any other editor, snippets are not related to snippets, they are relatively isolated, which makes it difficult to write more complex snippets that are closer to the real business. To solve this problem, I designed and implemented this library for composing snippets.



Before, we can't compose snippets. ☹️

![before.drawio](https://github.com/ascodelife/snippet-composer/blob/master/doc/img/before.drawio.png)



When we use this library, we can compose any snippets if we want.😊

![after.drawio](https://github.com/ascodelife/snippet-composer/blob/master/doc/img/after.drawio.png)

✨This library has the following features.

1. Compose multiple code snippets
2. Renumber tabstops
3. Custom variable

## 🔨Usage

1. Body recompose

   The syntax of body recompose is `${SnippetName[BodyIndex]}`，support for slice syntax.

```javascript
// snippet.json
{
    foo: {
        prefix: ['foo'],
        body: [
           'line0',
           'line1',
           'line2',
        ],
    },
}
// body replace result

'${foo[0]}' -> 'line0'
'${foo[0,1]}' -> 'line0\tline1'
'${foo[1,]}' -> 'line1\tline2'
```

2. Renumber tabstops

   The syntax of renumber tabstops is `${TheNewNumber:[SnippetName$BodyIndex]}`, it depends on the field `extra.tabstops`.
```javascript
// snippet.json
{
    foo: {
        prefix: ['foo'],
        body: [
          'foo code $1',
          'foo code $2',
        ],
    },
    bar: {
        prefix: ['bar'],
        body: [
          'bar code $1',
          'bar code $2',
        ],
    }
}
// tabstops demo
{
	....
    body:['${foo[0]}','${foo[1]}','${bar[0]}','${bar[1]}'],
    extra: {
        tabstops:{
            2:['foo$2','bar$1'],
            3:['bar$2'],
        }
    }
}
```
```diff
// Compose bodies, and then the new bodies are as follows after replacing tabstops.
body: [
    'foo code $1',
    'foo code $2',
-   'bar code $1',
+   'bar code $2',
-   'bar code $2',
+   'bar code $3'
]
```

3. Custom variable

   The syntax of custom variable is `$CustomVarName`, it depends on the field `extra.customVar`.

```javascript
/************* snippet.json *************/
{
	mysql: {
        prefix: ['ms'],
        body: [
            'import mysql from mysql',
            'mysql.connect($USER_NAME,$USER_PASSWORD,$1);',
            ],
        },
}
// customVar demo
{
    .....
    extra: {
        customVar: {
            USER_NAME: 'admin',
            USER_PASSWORD: () => '123',
        },
    }
}

'mysql.connect($USER_NAME,$USER_PASSWORD,$1);' -> 'mysql.connect(admin,123,$1);'
```

**A simple demo**

```javascript
/************* snippet1.json *************/
{
      mysql: {
        prefix: ['ms'],
        body: [
          'import mysql from mysql',
          'mysql.connect($USER_NAME,$USER_PASSWORD,$1);',
        ],
      },
      assert: {
        prefix: ['as'],
        body: [
          'import assert from assert',
          'assert(a,1);\rassert(b,$1);\rassert(c,$2);',
          '$0',
        ],
      },
}
/************* snippet2.json *************/
{
      utils: {
        prefix: ['utils'],
        body: [
          'function delay() {\r\tsleep($1);\r}',
          'function getPort() {\r\treturn ${2};\r}',
        ],
      },
}

/************* index.js *************/
import snippet1 from "./snippet1.json";
import snippet2 from "./snippet2.json";

const newSnippet = defineSnippet(
    // Parameter 1 is the extended snippet, which is responsible for composing the snippet.
    {
        'Test Case': {
            prefix: ['tc'],
            description: 'Test Case',
            scope: 'javascript',
            // recompose snippet1 and snippet2
            body: [
                '${mysql[0]}',
                '${assert[0]}',
                '${mysql[1]}\r${assert[1,3]}',
                '${utils[0,]}',
            ],
            // extra field
            extra: {
                tabstops: {
                    1: ['mysql$1', 'utils$2'],
                    2: ['assert$1'],
                    3: ['assert$2'],
                    4: ['utils$1'],
                },
                customVar: {
                    USER_NAME: 'admin',
                    USER_PASSWORD: () => '123',
                },
            },
        },
    },
    // Parameter 2, pass in an array of snippets to be composed.
    [snippet1, snippet2],
);

// Expect result of new snippet
expect(newSnippet).toEqual({
    'Test Case': {
        prefix: ['tc'],
        description: 'Test Case',
        body: [
            'import mysql from mysql',
            'import assert from assert',
            'mysql.connect(admin,123,$1);\rassert(a,1);\rassert(b,$2);\rassert(c,$3);\r$0',
            'function delay() {\r\tsleep($4);\r}\rfunction getPort() {\r\treturn ${1};\r}',
        ],
    },
});
```




## 💻Examples

- Edit on CodeSandbox.

  [![Edit example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/snippet-composer-example-b4klip?file=/src/index.js)


- Clone repo and run the example.（For vscode & nodejs)

  ```bash
  git clone https://github.com/ascodelife/snippet-composer
  cd snippet-composer && pnpm install
  cd example && pnpm install && pnpm run start
  ```



