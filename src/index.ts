import {
  getTabstopsRecord,
  replaceBody,
  replaceCustomVar,
  replaceTabstops,
} from './replace';
import {
  BodyRecord,
  ExtraSnippet,
  Snippet,
  SnippetItem,
  TabstopsRecord,
} from './types';
import { mergeSnippet } from './utils';

export * from './types';

export default function defineSnippet(
  config: ExtraSnippet,
  snippets: Snippet[],
) {
  const bodyRecord = mergeSnippet(snippets);

  const newSnippet: Snippet = Object.entries(config).reduce(
    (newSnippet, [snippetName, snippetItem]) => {
      let tabstopsRecord: TabstopsRecord | undefined;
      if (snippetItem.extra?.tabstops) {
        tabstopsRecord = getTabstopsRecord(snippetItem.extra?.tabstops);
      }
      const newBodyRecord = Object.entries(bodyRecord).reduce(
        (bodyRecord, [snippetName, body]) => {
          bodyRecord[snippetName] = body.map(code =>
            replaceTabstops(code, snippetName, { tabstopsRecord }),
          );
          return bodyRecord;
        },
        {} as BodyRecord,
      );

      let body = snippetItem.body.map(code =>
        replaceBody(code, { bodyRecord: newBodyRecord }),
      );

      body = body.map(code =>
        replaceCustomVar(code, {
          customVarRecord: snippetItem.extra?.customVar,
        }),
      );

      const newSnippetItem: SnippetItem = {
        prefix: snippetItem.prefix,
        scope: snippetItem.scope,
        description: snippetItem.description,
        body,
      };
      newSnippet[snippetName] = newSnippetItem;
      return newSnippet;
    },
    {} as Snippet,
  );

  return newSnippet;
}
