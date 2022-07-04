import defineSnippet, { Snippet } from 'snippet-composer';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const snippet1: Snippet = JSON.parse(
  readFileSync(resolve(__dirname, '../../.vscode/snippet1.code-snippets'), {
    encoding: 'utf8',
  }),
);

const snippet2: Snippet = JSON.parse(
  readFileSync(resolve(__dirname, '../../.vscode/snippet2.code-snippets'), {
    encoding: 'utf8',
  }),
);

const newSnippet = defineSnippet(
  {
    'Test Case': {
      prefix: ['tc'],
      description: 'Test Case',
      body: [
        '${mysql[0]}',
        '${assert[0]}',
        '${mysql[1]}\r${assert[1,3]}',
        '${utils[0,]}',
      ],
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
  [snippet1, snippet2],
);

writeFileSync(
  resolve(__dirname, '../../.vscode/newSnippet.code-snippets'),
  JSON.stringify(newSnippet),
);
