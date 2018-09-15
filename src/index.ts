import { ILayoutRestorer, JupyterLabPlugin } from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { IEditorServices } from '@jupyterlab/codeeditor';
import { IConsoleTracker } from '@jupyterlab/console';
import { ISettingRegistry } from '@jupyterlab/coreutils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { IEditorTracker } from '@jupyterlab/fileeditor';
import { ILauncher } from '@jupyterlab/launcher';
import { IMainMenu } from '@jupyterlab/mainmenu';

import { activate } from './activate';
import '../style/index.css';

export const ID = 'pymote-editor';

const extension: JupyterLabPlugin<IEditorTracker> = {
  activate,
  id: ID,
  requires: [
    IConsoleTracker,
    IEditorServices,
    IFileBrowserFactory,
    ILayoutRestorer,
    ISettingRegistry
  ],
  optional: [ICommandPalette, ILauncher, IMainMenu],
  provides: IEditorTracker,
  autoStart: true
};

export default extension;
