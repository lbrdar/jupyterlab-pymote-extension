import { PathExt } from '@jupyterlab/coreutils';

// returns hexadecimal color for given string
export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

export function normalizeExtension(extension: string) {
  if (extension.length > 0 && extension.indexOf('.') !== 0) {
    extension = `.${extension}`;
  }
  return extension;
}

export function normalize(path: string) {
  const parts = path.split(':');
  if (parts.length === 1) {
    return PathExt.normalize(path);
  }
  return `${parts[0]}:${PathExt.normalize(parts.slice(1).join(':'))}`;
}