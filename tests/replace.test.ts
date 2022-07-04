/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-template-curly-in-string */
import {
  getTabstopsRecord,
  replaceBody,
  replaceCustomVar,
  replaceTabstops,
} from '@/replace';
import { CustomVarRecord, ExtraFields } from '@/types';

describe('Replace cases', () => {
  test('replaceBody', () => {
    const bodyRecord = {
      'Foo Bar': ['console.log("Foo Bar");'],
      F_B: [
        'console.log("A");',
        'console.log("B");',
        'console.log("C");',
        'console.log("D");',
      ],
    };
    const code = '${Foo Bar[0]}${F_B[2,]}${F_B[0,2]}${B_F[0]}';
    expect(replaceBody(code)).toBe(code);
    const newCode = replaceBody(code, { bodyRecord });
    expect(newCode).toBe(
      'console.log("Foo Bar");console.log("C");\rconsole.log("D");console.log("A");\rconsole.log("B");${B_F[0]}',
    );
  });
  test('getTabstopsRecord', () => {
    const tabstops: ExtraFields['tabstops'] = {
      1: ['a$2', 'b$2'],
      3: ['c$1', 'a$4'],
    };
    const tabstopsRecord = getTabstopsRecord(tabstops);
    expect(tabstopsRecord).toEqual({
      a: {
        2: 1,
        4: 3,
      },
      b: {
        2: 1,
      },
      c: {
        1: 3,
      },
    });
    const tabstopsNotMatched = {
      1: ['a'],
    };
    expect(() => getTabstopsRecord(tabstopsNotMatched)).toThrow(
      Error('Match a fail'),
    );
  });
  test('replaceTabstops', () => {
    const tabstops: ExtraFields['tabstops'] = {
      1: ['a$2', 'b$2'],
      3: ['c$1', 'a$4'],
    };
    const tabstopsRecord = getTabstopsRecord(tabstops);
    const code = '$2 foo${1} ${2|foo,bar|}bar${1:foo}${4/find/replace/gmi}';
    expect(replaceTabstops(code, 'a')).toBe(code);
    const newCode = replaceTabstops(code, 'a', {
      tabstopsRecord,
    });
    expect(newCode).toBe(
      '$1 foo${1} ${1|foo,bar|}bar${1:foo}${3/find/replace/gmi}',
    );
  });
  test('replaceCustomVar', () => {
    const customVarRecord: CustomVarRecord = {
      FOO: 'foo',
      FOO_BAR: () => 'console.log(foo_bar);',
    };
    const code = '$FOO and $FOO_BAR';
    expect(replaceCustomVar(code)).toBe(code);
    const newCode = replaceCustomVar(code, { customVarRecord });
    expect(newCode).toBe('foo and console.log(foo_bar);');
  });
});
