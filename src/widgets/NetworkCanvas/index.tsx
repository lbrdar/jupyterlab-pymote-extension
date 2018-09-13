import {
  Message
} from '@phosphor/messaging';

import {
  Widget
} from '@phosphor/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class NetworkCanvas extends React.PureComponent {
  render() {
    return (
      <div>
        Placeholder
      </div>
    );
  }
}

export class NetworkCanvasWidget extends Widget {
  constructor() {
    super();

    this.id = 'network-canvas';
    this.node.appendChild(document.createElement('div'));
  }

  protected onAfterAttach(msg: Message): void {
    this.update();
  }

  protected onUpdateRequest(msg: Message): void {
    const host = this.node.firstChild as Element;
    ReactDOM.render(<NetworkCanvas />, host);
  }
}
