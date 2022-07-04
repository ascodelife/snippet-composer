/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-template-curly-in-string */
import defineSnippet from '@/index';
import { Snippet } from '@/types';

describe('Index cases', () => {
  test('defineSnippet', () => {
    const snippet1: Snippet = {
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
    };
    const snippet2: Snippet = {
      utils: {
        prefix: ['utils'],
        body: [
          'function delay() {\r\tsleep($1);\r}',
          'function getPort() {\r\treturn ${2};\r}',
        ],
      },
    };
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
  });
});
