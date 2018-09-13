/* eslint-disable no-param-reassign */
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Stage, Layer, Circle, Line, Rect, Group } from 'react-konva';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import EdgeDetails from './EdgeDetails';
import NodeDetails from './NodeDetails';
import NetworkDetails from './NetworkDetails';
import GenerateNetwork from './GenerateNetwork';
import ImageWrapper from './ImageWrapper';
import constants from '../consts';

const styles = {
  networkContainer: {
    margin: '0 auto',
    position: 'relative'
  },
  canvas: {
    border: '1px solid black'
  },
  generateNetworkButton: {
    position: 'absolute',
    right: 0
  }
};

class Network extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedNode: null,
      selectedEdge: null,
      showNodeDetails: false,
      showEdgeDetails: false,
      showSettings: false,
      showGenerateNetwork: false
    };
  }

  onSettingsClick = () => this.setState({ showSettings: true });

  onGenerateNetworkClick = () => this.setState({ showGenerateNetwork: true });

  onStageClick = ({ evt }) => {
    this.setState({ selectedNode: null });

    if (this.props.configurable) this.createNode(evt.offsetX, evt.offsetY);
  };

  onEdgeClick = ({ target }) => this.setState({ selectedEdge: this.props.edges[target.attrs.index] });
  onEdgeDoubleClick = () => this.openModal('Edge');

  onNodeClick = ({ target }) => {
    const { selectedNode } = this.state;
    const { edges, nodes, settings, configurable, setEdges, setSelectedNode } = this.props;
    const allowChange = configurable && !settings.useCommRange;
    const clickedNode = nodes.filter(node => (node.id === target.attrs.id))[0];

    if (allowChange && selectedNode !== null && clickedNode.id !== selectedNode.id) {
      edges.push([
        {
          id: selectedNode.id,
          x: selectedNode.x,
          y: selectedNode.y
        },
        {
          id: clickedNode.id,
          x: clickedNode.x,
          y: clickedNode.y
        }
      ]);
      this.setState({ selectedNode: null });
      setSelectedNode(null);
      setEdges(edges);
    } else {
      this.setState({ selectedNode: clickedNode });
      setSelectedNode(clickedNode);
    }
  };
  onNodeDoubleClick = () => this.openModal('Node');
  onNodeDragMove = ({ evt, target }) => {
    if (!this.props.configurable) return;

    const { offsetX: x, offsetY: y } = evt;
    const { attrs: { id: draggedNodeId } } = target;

    if (!this.props.settings.useCommRange) { // if using commRange, no need for this because all edges will be recalculated
      const edges = this.props.edges.map((edge) => {
        if (edge[0].id === draggedNodeId) {
          edge[0].x = x;
          edge[0].y = y;
        } else if (edge[1].id === draggedNodeId) {
          edge[1].x = x;
          edge[1].y = y;
        }

        return edge;
      });
      this.props.setEdges(edges);
    }

    const nodes = this.props.nodes.map((node) => {
      if (node.id === draggedNodeId) {
        node.x = x;
        node.y = y;
      }
      return node;
    });

    const { selectedNode } = this.state;
    if (selectedNode && selectedNode.id === draggedNodeId) {
      selectedNode.x = x;
      selectedNode.y = y;
    }

    this.setState({ selectedNode });
    this.props.setSelectedNode(selectedNode);
    this.props.setNodes(nodes);
  };

  openModal = type => this.setState({ [`show${type}Details`]: true });
  closeModal = () => this.setState({
    showSettings: false,
    showNodeDetails: false,
    showEdgeDetails: false,
    showGenerateNetwork: false,
    selectedNode: null,
    selectedEdge: null
  });

  createNode = (x, y) => {
    const { nodes, setNodes, settings } = this.props;
    nodes.push({
      id: Date.now(), // dummy temporary id
      x,
      y,
      theta: settings.defaultTheta,
      commRange: settings.defaultCommRange,
      status: '',
      inbox: [],
      outbox: [],
      memory: {}
    });

    setNodes(nodes);
  };
  updateNode = (oldNode, newNode) => {
    const { nodes, setNodes } = this.props;
    nodes.splice(nodes.indexOf(oldNode), 1, newNode);
    setNodes(nodes);
  };
  deleteNode = (node) => {
    const { edges, nodes, settings, setEdges, setNodes } = this.props;
    nodes.splice(nodes.indexOf(node), 1);
    if (!settings.useCommRange) {
      // remove all edges connected to that node
      const newEdges = edges.filter(edge => (edge[0].id !== node.id && edge[1].id !== node.id));
      setEdges(newEdges);
    }
    setNodes(nodes);
    this.closeModal();
  };

  deleteEdge = (edge) => {
    const { edges, setEdges } = this.props;
    edges.splice(edges.indexOf(edge), 1);
    setEdges(edges);
    this.closeModal();
  };

  renderMsgIcons = (node, index) => {
    const hasInbox = !!node.inbox.length;
    const hasOutbox = !!node.outbox.length;

    if (!hasInbox && !hasOutbox) return null;

    return (
      <Group key={index}>
      {hasInbox &&
      <ImageWrapper
    image="https://cdn2.iconfinder.com/data/icons/online-communication-ii/24/Material_icons-04-55-128.png"
    width={constants.BOX_IMG_SIZE}
    height={constants.BOX_IMG_SIZE}
    x={node.x}
    y={node.y + (constants.NODE_SIZE / 4)}
    />
  }
    {hasOutbox &&
    <ImageWrapper
      image="https://cdn2.iconfinder.com/data/icons/online-communication-ii/24/Material_icons-04-57-128.png"
      width={constants.BOX_IMG_SIZE}
      height={constants.BOX_IMG_SIZE}
      x={node.x - constants.BOX_IMG_SIZE}
      y={node.y + (constants.NODE_SIZE / 4)}
      />
    }
  </Group>
  );
  };

  renderNode = (node, index) => {
    const { statusColors } = this.props;
    const isSelected = (this.state.selectedNode && this.state.selectedNode.id === node.id);
    let nodeColor = isSelected ? 'red' : 'green';
    if (statusColors && !isSelected) nodeColor = statusColors[node.status];

    return (
      <Circle
    key={node.id}
    id={node.id}
    index={index}
    x={node.x}
    y={node.y}
    radius={constants.NODE_SIZE}
    fill={nodeColor}
    shadowBlur={10}
    draggable={this.props.configurable}
    onClick={this.onNodeClick}
    onDblclick={this.onNodeDoubleClick}
    onDragMove={this.onNodeDragMove}
    />
  );
  };

  renderEdge = (edge, index) => {
    const { selectedEdge } = this.state;
    const isSelected = (selectedEdge && selectedEdge[0].id === edge[0].id && selectedEdge[1].id === edge[1].id);
    return (
      <Line
    key={`${edge[0].id}-${edge[1].id}`}
    index={index}
    points={[edge[0].x, edge[0].y, edge[1].x, edge[1].y]}
    stroke={isSelected ? 'red' : 'black'}
    onClick={this.onEdgeClick}
    onDblclick={this.onEdgeDoubleClick}
    />
  );
  };

  render() {
    const { selectedNode, selectedEdge, showNodeDetails, showEdgeDetails, showSettings, showGenerateNetwork } = this.state;
    const { settings: { width, height, useCommRange }, edges, nodes, configurable } = this.props;

    return (
      <div style={{ ...styles.networkContainer, width: `${width + 2}px` }}>
  <Paper zDepth={2}>
      <Stage width={width} height={height} style={styles.canvas}>
  <Layer>
    <Rect x={0} y={0} width={width} height={height} onClick={this.onStageClick} />
    { edges.map(this.renderEdge) }
    { nodes.map(this.renderNode) }
    { nodes.map(this.renderMsgIcons) }
  </Layer>
    </Stage>
    {showNodeDetails &&
    <NodeDetails
      node={selectedNode}
      networkLimits={{ x: width, y: height }}
      configurable={configurable}
      closeModal={this.closeModal}
      updateNode={this.updateNode}
      deleteNode={this.deleteNode}
      />
    }
    {showEdgeDetails &&
    <EdgeDetails
      edge={selectedEdge}
      configurable={configurable && !useCommRange}
      closeModal={this.closeModal}
      deleteEdge={this.deleteEdge}
      />
    }
    {showSettings &&
    <NetworkDetails
      settings={this.props.settings}
      configurable={configurable}
      closeModal={this.closeModal}
      updateNetwork={this.props.setSettings}
      />
    }
    {showGenerateNetwork &&
    <GenerateNetwork
      settings={this.props.settings}
      closeModal={this.closeModal}
      generateNetwork={this.props.generateNetwork}
      />
    }
  </Paper>
    {configurable && <RaisedButton secondary label="Network settings" onClick={this.onSettingsClick} />}
      {configurable &&
      <RaisedButton
        primary
        label="Generate network"
        style={styles.generateNetworkButton}
        onClick={this.onGenerateNetworkClick}
        />
      }
    </div>
    );
  }
}

Network.propTypes = {
  settings: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    defaultCommRange: PropTypes.number,
    defaultTheta: PropTypes.number,
    useCommRange: PropTypes.bool
  }).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  edges: PropTypes.arrayOf(PropTypes.array).isRequired,
  setNodes: PropTypes.func,
  setEdges: PropTypes.func,
  setSettings: PropTypes.func,
  setSelectedNode: PropTypes.func,
  generateNetwork: PropTypes.func,
  configurable: PropTypes.bool,
  statusColors: PropTypes.shape({})
};

Network.defaultProps = {
  width: constants.NETWORK_WIDTH,
  height: constants.NETWORK_HEIGHT,
  setNodes: () => {},
  setEdges: () => {},
  setSettings: () => {},
  setSelectedNode: () => {},
  generateNetwork: () => {},
  configurable: false,
  statusColors: null
};

export default Network;
