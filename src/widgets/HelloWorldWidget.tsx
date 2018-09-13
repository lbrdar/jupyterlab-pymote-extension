import {
  Message
} from '@phosphor/messaging';

import {
  Widget
} from '@phosphor/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class HelloWorld extends React.PureComponent {
  render() {
    return (
      <div>
        Hello world
      </div>
    );
  }
}

export class HelloWorldWidget extends Widget {
  constructor() {
    super();
    
    this.id = 'hello-world';
    this.node.appendChild(document.createElement('div'));
  }

  protected onAfterAttach(msg: Message): void {
    this.update();
  }

  protected onUpdateRequest(msg: Message): void {
    const host = this.node.firstChild as Element;
    ReactDOM.render(<HelloWorld />, host);
  }
}
