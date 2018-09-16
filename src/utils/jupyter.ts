import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services/lib/serverconnection';

import { normalizeExtension } from './';

const SERVICE_DRIVE_URL = 'api/contents';

function _getUrl(...args: Array<any>) {
  const parts = args.map(path => URLExt.encodeParts(path));
  const baseUrl = ServerConnection.makeSettings().baseUrl;
  return URLExt.join(baseUrl, SERVICE_DRIVE_URL, ...parts);
}

export function newFile(options: any = {}) {
  let body = '{}';
  if (options) {
    if (options.ext) {
      options.ext = normalizeExtension(options.ext);
    }
    body = JSON.stringify(options);
  }
  const settings = ServerConnection.makeSettings();
  const url = _getUrl(options.path || '');
  let init = {
    method: 'POST',
    body
  };
  return ServerConnection.makeRequest(url, init, settings)
    .then(response => {
      if (response.status !== 201) {
        throw new ServerConnection.ResponseError(response);
      }
      return response.json();
    });
}

export function updateFile(options: any = {}) {
  let body = '{}';
  if (options) {
    if (options.ext) {
      options.ext = normalizeExtension(options.ext);
    }
    body = JSON.stringify(options);
  }
  const settings = ServerConnection.makeSettings();
  const url = _getUrl(options.path || '');
  let init = {
    method: 'PUT',
    body
  };
  return ServerConnection.makeRequest(url, init, settings)
    .then(response => {
      if (response.status !== 200) {
        throw new ServerConnection.ResponseError(response);
      }
      return response.json();
    });
}
