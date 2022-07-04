/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-template-curly-in-string */
import {
  getCustomVarRegex,
  getTabstopsRegex,
  getBodyRegex,
  getTabstopsRecordRegex,
} from '@/regex';

describe('Regex cases', () => {
  test('custom var regex', () => {
    const reg = getCustomVarRegex();
    const str = '12$aaa$-$1231 12331$3A12_df$a';
    expect(str.match(reg)).toEqual(['$aaa', '$1231', '$3A12_df', '$a']);
  });
  test('tab stops regex', () => {
    const reg = getTabstopsRegex();
    const str =
      '$0foo${1:another ${2:placeholder}}bar ${3|defaultA,defaultB|} ${4/find/replace/gmi}';
    expect(str.match(reg)).toEqual(['0', '1', '2', '3', '4']);
  });
  test('body regex', () => {
    const reg = getBodyRegex();
    const str = '${Foo Bar[0]}\t${F_B[1,]}${F_B[1,3]}';
    let res = reg.exec(str);
    expect(res?.slice(0, 3)).toEqual(['${Foo Bar[0]}', 'Foo Bar', '0']);
    res = reg.exec(str);
    expect(res?.slice(0, 4)).toEqual(['${F_B[1,]}', 'F_B', '1', ',']);
    res = reg.exec(str);
    expect(res?.slice(0, 5)).toEqual(['${F_B[1,3]}', 'F_B', '1', ',', '3']);
  });

  test('tabstops record regex', () => {
    const reg = getTabstopsRecordRegex();
    const str = 'WE EWR_A 123$31';
    const res = reg.exec(str);
    expect(res?.slice(0, 3)).toEqual([str, 'WE EWR_A 123', '31']);
  });
});
