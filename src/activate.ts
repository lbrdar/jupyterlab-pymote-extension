import { JupyterLab, ILayoutRestorer } from '@jupyterlab/application';
import { ICommandPalette, InstanceTracker } from '@jupyterlab/apputils';
import { CodeEditor, IEditorServices } from '@jupyterlab/codeeditor';
import { IConsoleTracker } from '@jupyterlab/console';
import { ISettingRegistry } from '@jupyterlab/coreutils';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { FileEditor, FileEditorFactory, IEditorTracker } from '@jupyterlab/fileeditor';
import { ILauncher } from '@jupyterlab/launcher';
import { IEditMenu, IFileMenu, IMainMenu, IRunMenu } from '@jupyterlab/mainmenu';

import { JSONExt } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';

import { ID } from './index';
import { NetworkCanvasWidget } from './widgets/NetworkCanvas';

const NETWORK_CANVAS_ID = 'network-canvas';
const FACTORY = 'Editor';

namespace CommandIDs {
  export const createNew = `${ID}:create-new`;
  export const createConsole = `${ID}:create-console`;
  export const runCode = `${ID}:run-code`;
  export const openNetworkCanvas = `${NETWORK_CANVAS_ID}:open-network-canvas`;
}

export function activate(
  app: JupyterLab,
  consoleTracker: IConsoleTracker,
  editorServices: IEditorServices,
  browserFactory: IFileBrowserFactory,
  restorer: ILayoutRestorer,
  settingRegistry: ISettingRegistry,
  palette: ICommandPalette | null,
  launcher: ILauncher | null,
  menu: IMainMenu | null
): IEditorTracker {
  let networkCanvasWidget: NetworkCanvasWidget;

  const factory = new FileEditorFactory({
    editorServices,
    factoryOptions: {
      name: FACTORY,
      fileTypes: ['markdown', '*'], // Explicitly add the markdown fileType so
      defaultFor: ['markdown', '*'] // it outranks the defaultRendered viewer.
    }
  } as any);

  const docTracker = new InstanceTracker<Widget>({ namespace: ID });
  const networkCanvasTracker = new InstanceTracker<Widget>({ namespace: NETWORK_CANVAS_ID });

  const isEnabled = () =>
    docTracker.currentWidget !== null &&
    docTracker.currentWidget === app.shell.currentWidget;

  const config = { ...CodeEditor.defaultConfig };

  // Handle state restoration.
  restorer.restore(docTracker, {
    command: 'docmanager:open',
    args: widget => ({ path: widget.context.path, factory: FACTORY }),
    name: widget => widget.context.path
  });
  restorer.restore(networkCanvasTracker, {
    command: CommandIDs.openNetworkCanvas,
    args: () => JSONExt.emptyObject,
    name: () => NETWORK_CANVAS_ID
  });

  /**
   * Update the settings of a widget.
   */
  function updateWidget(widget: FileEditor): void {
    const editor = widget.editor;
    Object.keys(config).forEach((key: any) => {
      editor.setOption(key, config[key as keyof CodeEditor.IConfig]);
    });
  }

  factory.widgetCreated.connect((sender, widget) => {
    // Notify the instance tracker if restore data needs to update.
    widget.context.pathChanged.connect(() => {
      docTracker.save(widget);
    });
    docTracker.add(widget);
    updateWidget(widget.content);
  });

  // Handle the settings of new widgets.
  docTracker.widgetAdded.connect((sender, widget: any) => {
    updateWidget(widget.content);
  });

  app.commands.addCommand(CommandIDs.createConsole, {
    execute: args => {
      const widget = docTracker.currentWidget as any;

      if (!widget) {
        return;
      }

      return app.commands.execute('console:create', {
        activate: args['activate'],
        path: widget.context.path,
        preferredLanguage: widget.context.model.defaultKernelLanguage,
        ref: widget.id,
        insertMode: 'split-bottom'
      });
    },
    isEnabled,
    label: 'Create Console for Pymote Editor'
  });

  app.commands.addCommand(CommandIDs.runCode, {
    execute: () => {
      const widget = (docTracker.currentWidget as any).content;

      if (!widget) {
        return;
      }

      const editor = widget.editor;
      const path = widget.context.path;
      const selection = editor.getSelection();
      const code = editor.getLine(selection.start.line);

      if (code) {
        return app.commands.execute('console:inject', { activate: false, code, path });
      } else {
        return Promise.resolve(void 0);
      }
    },
    isEnabled,
    label: 'Run Pymote Algorithm'
  });

  app.commands.addCommand(CommandIDs.createNew, {
    label: 'Pymote Algorithm',
    caption: 'Create a new python algorithm file',
    execute: args => {
      let cwd = args['cwd'] || browserFactory.defaultBrowser.model.path;
      return app.commands
        .execute('docmanager:new-untitled', {
          ext: 'py',
          path: cwd,
          type: 'file',
          content: 'test',
        })
        .then(model => {
          return app.commands.execute('docmanager:open', {
            path: model.path,
            factory: FACTORY
          });
        });
    }
  });

  app.commands.addCommand(CommandIDs.openNetworkCanvas, {
    label: 'Open network canvas',
    execute: () => {
      if (!networkCanvasWidget) {
        // Create a new widget if one does not exist
        networkCanvasWidget = new NetworkCanvasWidget();
        networkCanvasWidget.update();
      }
      if (!networkCanvasTracker.has(networkCanvasWidget)) {
        // Track the state of the widget for later restoration
        networkCanvasTracker.add(networkCanvasWidget);
      }
      if (!networkCanvasWidget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.addToMainArea(networkCanvasWidget);
      }
      // Refresh the comic in the widget
      networkCanvasWidget.update();
      // Activate the widget
      app.shell.activateById(networkCanvasWidget.id);
    }
  });

  if (launcher) {
    launcher.add({
      command: CommandIDs.createNew,
      category: 'Other',
      rank: 1
    });
  }

  if (menu) {
    // Add new text file creation to the file menu.
    menu.fileMenu.newMenu.addGroup([{ command: CommandIDs.createNew }], 30);

    // Add undo/redo hooks to the edit menu.
    menu.editMenu.undoers.add({
      tracker: docTracker,
      undo: (widget: any) => {
        widget.content.editor.undo();
      },
      redo: (widget: any) => {
        widget.content.editor.redo();
      }
    } as IEditMenu.IUndoer<Widget>);

    // Add a console creator the the Kernel menu.
    menu.fileMenu.consoleCreators.add({
      tracker: docTracker,
      name: 'Pymote Editor',
      createConsole: (current: any) => {
        return app.commands.execute('console:create', {
          path: current.context.path,
          preferredLanguage: current.context.model.defaultKernelLanguage
        });
      }
    } as IFileMenu.IConsoleCreator<Widget>);

    // Add a code runner to the Run menu.
    menu.runMenu.codeRunners.add({
      tracker: docTracker,
      noun: 'Code',
      isEnabled: (current: any) => {
        let found = false;
        consoleTracker.forEach(console => {
          if (console.console.session.path === current.context.path) {
            found = true;
          }
        });
        return found;
      },
      run: () => app.commands.execute(CommandIDs.runCode)
    } as IRunMenu.ICodeRunner<Widget>);
  }

  if (palette) {
    palette.addItem({ command: CommandIDs.createConsole, category: 'Pymote' });
    palette.addItem({ command: CommandIDs.runCode, category: 'Pymote' });
    palette.addItem({ command: CommandIDs.createNew, category: 'Pymote' });
    palette.addItem({ command: CommandIDs.openNetworkCanvas, category: 'Pymote' });
  }

  app.contextMenu.addItem({
    command: CommandIDs.createConsole,
    selector: '.jp-FileEditor'
  });

  app.contextMenu.addItem({
    command: CommandIDs.runCode,
    selector: '.jp-FileEditor'
  });

  return docTracker as any;
}
