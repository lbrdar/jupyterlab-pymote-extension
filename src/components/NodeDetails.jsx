import * as PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';

const styles = {
  errorMsg: {
    flex: 1,
    color: 'red',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textLabel: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: 'black'
  },
  modalTitleContainer: {
    position: 'relative'
  },
  modalTitle: {
    display: 'inline-block'
  },
  modalDeleteButton: {
    display: 'inline-block',
    position: 'absolute',
    right: '24px'
  }
};


class NodeDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      x: props.node.x,
      y: props.node.y,
      theta: props.node.theta,
      commRange: props.node.commRange,
      memory: JSON.stringify(props.node.memory, null, 2),
      error: ''
    };
  }

  isValid = () => {
    const { x, y, theta, commRange, memory } = this.state;
    const { networkLimits } = this.props;
    const parsedX = parseFloat(x);
    const parsedY = parseFloat(y);
    const parsedTheta = parseFloat(theta);
    const parsedCommRange = parseFloat(commRange);
    let parsedMemory = null;
    try {
      parsedMemory = JSON.parse(memory);
    } catch (e) {
      this.setState({ error: 'Memory must be in a format of an object containing "key":"value" pairs.' });
      return false;
    }

    if (isNaN(parsedX) || parsedX < 0 || parsedX > networkLimits.x) {
      this.setState({ error: 'Invalid position x value.' });
      return false;
    }
    if (isNaN(parsedY) || parsedY < 0 || parsedY > networkLimits.x) {
      this.setState({ error: 'Invalid position y value.' });
      return false;
    }
    if (isNaN(parsedTheta) || parsedTheta < 0 || parsedTheta > 360) {
      this.setState({ error: 'Invalid theta value.' });
      return false;
    }
    if (isNaN(parsedCommRange) || parsedCommRange <= 0) {
      this.setState({ error: 'Invalid communication range.' });
      return false;
    }
    if (parsedMemory !== Object(parsedMemory)) {
      this.setState({ error: 'Memory must be in a format of an object containing "key":"value" pairs.' });
      return false;
    }

    return true;
  };

  save = () => {
    const { x, y, theta, commRange, memory } = this.state;
    const { id, status, inbox, outbox } = this.props.node;

    if (!this.isValid()) return;

    this.props.updateNode(
      this.props.node,
      {
        id,
        x: parseFloat(x),
        y: parseFloat(y),
        theta: parseFloat(theta),
        commRange: parseFloat(commRange),
        status,
        inbox,
        outbox,
        memory: JSON.parse(memory)
      }
    );
    this.props.closeModal();
  };

  remove = () => this.props.deleteNode(this.props.node);

  renderTitle = () => (
    <div style={styles.modalTitleContainer}>
      <p style={styles.modalTitle}>Node details</p>
      { this.props.configurable &&
        <RaisedButton
          label="Delete"
          icon={<DeleteForever />}
          secondary={true}
          style={styles.modalDeleteButton}
          onClick={this.remove}
        />
      }
    </div>
  );

  render() {
    const { x, y, theta, commRange, memory, error } = this.state;
    const { configurable, node: { id, status, inbox, outbox } } = this.props;
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.closeModal}
      />
    ];

    if (configurable) {
      actions.push(
        <RaisedButton
          label="Save changes"
          primary={true}
          keyboardFocused={true}
          onClick={this.save}
        />
      );
    }

    return (
      <Dialog
        title={this.renderTitle()}
        actions={actions}
        modal={false}
        autoScrollBodyContent
        open
        onRequestClose={this.props.closeModal}
      >
        { !!error && <div style={styles.errorMsg}>{error}</div> }
        <TextField
          disabled
          fullWidth
          floatingLabelText="Id"
          value={id}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="X position"
          floatingLabelStyle={styles.textLabel}
          value={x}
          onChange={(e, text) => this.setState({ x: text })}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Y position"
          floatingLabelStyle={styles.textLabel}
          value={y}
          onChange={(e, text) => this.setState({ y: text })}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Theta"
          floatingLabelStyle={styles.textLabel}
          value={theta}
          onChange={(e, text) => this.setState({ theta: text })}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Communication range"
          floatingLabelStyle={styles.textLabel}
          value={commRange}
          onChange={(e, text) => this.setState({ commRange: text })}
        />
        <TextField
          disabled
          fullWidth
          floatingLabelText="Status"
          floatingLabelStyle={styles.textLabel}
          value={status || ' '}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Memory"
          floatingLabelStyle={styles.textLabel}
          multiLine
          rows={5}
          value={memory}
          onChange={(e, text) => this.setState({ memory: text })}
        />
        <TextField
          disabled
          fullWidth
          floatingLabelText="Inbox"
          floatingLabelStyle={styles.textLabel}
          multiLine
          rows={5}
          value={inbox.join()}
        />
        <TextField
          disabled
          fullWidth
          floatingLabelText="Outbox"
          floatingLabelStyle={styles.textLabel}
          multiLine
          rows={5}
          value={outbox.join()}
        />
      </Dialog>
    );
  }
}

NodeDetails.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    theta: PropTypes.number,
    commRange: PropTypes.number,
    status: PropTypes.string,
    inbox: PropTypes.array,
    outbox: PropTypes.array,
    memory: PropTypes.object,
  }).isRequired,
  networkLimits: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  updateNode: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  configurable: PropTypes.bool.isRequired
};

export default NodeDetails;
