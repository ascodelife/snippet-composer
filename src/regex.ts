export function getCustomVarRegex() {
  return /\$(\w+)/g;
}

export function getTabstopsRegex() {
  return /(?<=\${)\d+(?=([:\\|\\/].+)?})|(?<=\$)\d+/g;
}

export function getBodyRegex() {
  return /\${([\w\s]+)\[(\d+)(,)?(\d+)?\]}/g;
}

export function getTabstopsRecordRegex() {
  return /(.+)\$(\d+)/;
}
