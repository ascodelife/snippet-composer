import { Snippet } from './types';

export function mergeSnippet(snippets: Snippet[]) {
  return snippets.reduce((bodyRecord: Record<string, string[]>, snippet) => {
    for (const [snippetName, item] of Object.entries(snippet)) {
      if (bodyRecord[snippetName]) {
        throw Error(`Duplicate snippet name ${snippetName}`);
      }
      bodyRecord[snippetName] = Array.isArray(item.body)
        ? item.body
        : [item.body];
    }
    return bodyRecord;
  }, {});
}
