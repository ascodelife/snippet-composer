import {
  getBodyRegex,
  getCustomVarRegex,
  getTabstopsRecordRegex,
  getTabstopsRegex,
} from './regex';
import {
  BodyRecord,
  CustomVarRecord,
  ExtraFields,
  TabstopsRecord,
} from './types';

interface ReplaceBodyOptions {
  bodyRecord?: BodyRecord;
}
export function replaceBody(code: string, options?: ReplaceBodyOptions) {
  if (!options?.bodyRecord) {
    return code;
  }
  const reg = getBodyRegex();
  return code.replaceAll(
    reg,
    function (
      match: string,
      snippetName: string,
      bodyStartIdx: string,
      comma: string | undefined,
      bodyEndIdx: string | undefined,
    ) {
      const body = options?.bodyRecord?.[snippetName];
      if (!body) {
        return match;
      }
      if (!comma && !bodyEndIdx) {
        return body[Number(bodyStartIdx)];
      }
      if (bodyEndIdx) {
        return body.slice(Number(bodyStartIdx), Number(bodyEndIdx)).join('\r');
      }
      if (comma) {
        return body.slice(Number(bodyStartIdx)).join('\r');
      }
      return match;
    },
  );
}

interface ReplaceTabstopsOptions {
  tabstopsRecord?: TabstopsRecord;
}
export function replaceTabstops(
  code: string,
  snippetName: string,
  options?: ReplaceTabstopsOptions,
) {
  if (!options?.tabstopsRecord) {
    return code;
  }
  const reg = getTabstopsRegex();
  return code.replaceAll(reg, function (match: string) {
    const newTabstops = options.tabstopsRecord?.[snippetName]?.[Number(match)];
    if (newTabstops) {
      return String(newTabstops);
    }
    return match;
  });
}
export function getTabstopsRecord(tabstops: ExtraFields['tabstops']) {
  const tabstopsRecord: TabstopsRecord = {};
  const reg = getTabstopsRecordRegex();
  for (const [newTabstops, snippetTabstops] of Object.entries(tabstops)) {
    for (const snippetTabstop of snippetTabstops) {
      const matches = reg.exec(snippetTabstop);
      if (!matches) {
        throw Error(`Match ${snippetTabstop} fail`);
      }
      const snippetName = matches[1];
      const tabstops = Number(matches[2]);
      if (!tabstopsRecord[snippetName]) {
        tabstopsRecord[snippetName] = {};
      }
      tabstopsRecord[snippetName][tabstops] = Number(newTabstops);
    }
  }
  return tabstopsRecord;
}

interface CustomVarOptions {
  customVarRecord?: CustomVarRecord;
}
export function replaceCustomVar(code: string, options?: CustomVarOptions) {
  if (!options?.customVarRecord) {
    return code;
  }
  const reg = getCustomVarRegex();
  return code.replaceAll(reg, function (match: string, customVarName: string) {
    const res = options?.customVarRecord?.[customVarName];
    if (typeof res === 'function') {
      return res();
    }
    if (typeof res === 'string') {
      return res;
    }
    return match;
  });
}
