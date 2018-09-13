import * as PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
  }
};


class GenerateNetwork extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numOfNodes: '10',
      networkType: 'random',
      error: ''
    };

    this.allowedNetworkTypes = ['Complete', 'Random', 'Star'];
  }


  onNumOfNodesChange = (e, text) => this.setState({ numOfNodes: text });
  onNetworkSelect = (event, index, value) => this.setState({ networkType: value });

  isValid = () => {
    const { numOfNodes } = this.state;
    const parsedNumOfNodes = parseInt(numOfNodes, 10);

    if (isNaN(parsedNumOfNodes) || parsedNumOfNodes <= 0) {
      this.setState({ error: 'Invalid number of nodes.' });
      return false;
    }

    return true;
  };

  save = () => {
    const { networkType, numOfNodes } = this.state;

    if (!this.isValid()) return;

    this.props.generateNetwork(networkType, numOfNodes, this.props.settings);
    this.props.closeModal();
  };

  renderNetworkType = type => (
    <MenuItem key={type} value={type.toLowerCase()} primaryText={type} />
  );

  render() {
    const { numOfNodes, networkType, error } = this.state;
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.closeModal}
      />,
      <RaisedButton
        label="Generate"
        primary={true}
        keyboardFocused={true}
        onClick={this.save}
      />
    ];

    return (
      <Dialog
        title="Generate network"
        actions={actions}
        modal={false}
        autoScrollBodyContent
        open
        onRequestClose={this.props.closeModal}
      >
        { !!error && <div style={styles.errorMsg}>{error}</div> }
        <TextField
          fullWidth
          floatingLabelText="Number of nodes"
          floatingLabelStyle={styles.textLabel}
          value={numOfNodes}
          onChange={this.onNumOfNodesChange}
        />
        <SelectField
          floatingLabelText="Network type"
          maxHeight={200}
          value={networkType}
          onChange={this.onNetworkSelect}
        >
          {this.allowedNetworkTypes.map(this.renderNetworkType)}
        </SelectField>
      </Dialog>
    );
  }
}

GenerateNetwork.propTypes = {
  settings: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    defaultCommRange: PropTypes.number,
    defaultTheta: PropTypes.number,
    useCommRange: PropTypes.bool
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  generateNetwork: PropTypes.func.isRequired
};

export default GenerateNetwork;
