import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';

import Network from '../../components/Network';
import constants from '../../consts';

interface ISettings {
  width: number;
  height: number;
  defaultCommRange: number;
  defaultTheta: number;
  useCommRange: boolean;
}

export default class NetworkCanvas extends React.Component {
  public state: {
    nodes: Array<any>;
    edges: Array<any>;
    settings: ISettings,
    showError: boolean;
    errorMsg: string;
  };

  constructor(props: any) {
    super(props);

    this.state = {
      nodes: [],
      edges: [],
      settings: {
        width: constants.NETWORK_WIDTH,
        height: constants.NETWORK_HEIGHT,
        defaultCommRange: constants.COMM_RANGE,
        defaultTheta: constants.THETA,
        useCommRange: false
      },
      showError: false,
      errorMsg: ''
    };

    /*this.state = {
      nodes: props.nodes,
      edges: props.edges,
      settings: {
        width: props.settings.width || constants.NETWORK_WIDTH,
        height: props.settings.height || constants.NETWORK_HEIGHT,
        defaultCommRange: props.settings.defaultCommRange || constants.COMM_RANGE,
        defaultTheta: props.settings.defaultTheta || constants.THETA,
        useCommRange: props.settings.useCommRange === 'true'
      },
      showError: false,
      errorMsg: ''
    };*/
  }

  setEdges = (edges: Array<any>) => this.setState({ edges });
  setNodes = (nodes: Array<any>) => this.setState({ nodes }, () => (this.state.settings.useCommRange && this.recalculateEdges()));
  setSettings = (settings: ISettings) => {
    if (!this.state.settings.useCommRange && settings.useCommRange) this.recalculateEdges();
    this.setState({ settings });
  };

  generateNetwork = (networkType: string, numOfNodes: number, settings: ISettings) => {
    let params = `networkType=${networkType}&&numOfNodes=${numOfNodes}`;
    if (settings) {
      params = `${params}&&settings=${JSON.stringify(settings)}`;
    }

    fetch(`http://127.0.0.1:8000/api/create_network/?${params}`, { mode: 'cors' })
    // fetch(`${config.apiURL}/create_network/?${params}`)
      .then(body => body.json())
      .then(res => this.setState({ edges: res.edges, nodes: res.nodes }));
  };

  recalculateEdges = () => {
    const { nodes } = this.state;
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 1; j < nodes.length; j++) {
        if (i !== j) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const d = Math.sqrt(((n1.x - n2.x) ** 2) + ((n1.y - n2.y) ** 2));
          if (d < n1.commRange && d < n2.commRange) {
            edges.push([
              {
                id: n1.id,
                x: n1.x,
                y: n1.y
              },
              {
                id: n2.id,
                x: n2.x,
                y: n2.y
              }
            ]);
          }
        }
      }
    }
    this.setState({ edges });
  };

  render() {
    const { edges, nodes, settings } = this.state;

    return (
      <MuiThemeProvider>
        <Network
          configurable
          edges={edges}
          generateNetwork={this.generateNetwork}
          nodes={nodes}
          settings={settings}
          setEdges={this.setEdges}
          setNodes={this.setNodes}
          setSettings={this.setSettings}
        />
      </MuiThemeProvider>
    );
  }
}