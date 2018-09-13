import {
  Message
} from '@phosphor/messaging';

import {
  Widget
} from '@phosphor/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import NetworkCanvas from './NetworkCanvas';

export class NetworkCanvasWidget extends Widget {
  constructor() {
    super();

    this.id = 'network-canvas';
    this.title.label = 'Network Canvas';
    this.title.closable = true;
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
