import { JupyterLab, ILayoutRestorer } from '@jupyterlab/application';
import { ICommandPalette, InstanceTracker } from '@jupyterlab/apputils';
import { JSONExt } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';

// import { XkcdWidget } from './XkcdWidget';
import { HelloWorldWidget } from './HelloWorldWidget';

export function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
  // Create a single widget
  let widget: HelloWorldWidget;

  // Add an application command
  const command: string = 'xkcd:open';
  app.commands.addCommand(command, {
    label: 'Random xkcd comic',
    execute: () => {
      if (!widget) {
        // Create a new widget if one does not exist
        widget = new HelloWorldWidget();
        widget.update();
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.addToMainArea(widget);
      }
      // Refresh the comic in the widget
      widget.update();
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });

  // Track and restore the widget state
  let tracker = new InstanceTracker<Widget>({ namespace: 'xkcd' });
  restorer.restore(tracker, {
    command,
    args: () => JSONExt.emptyObject,
    name: () => 'xkcd'
  });
}
