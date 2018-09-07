import { JupyterLabPlugin, ILayoutRestorer } from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';

import { activate } from './activate';
import '../style/index.css';


/**
 * Initialization data for the jupyterlab_xkcd extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab_xkcd',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate
};

export default extension;
