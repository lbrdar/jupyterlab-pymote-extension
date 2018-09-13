import * as PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

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
  toggle: {
    marginTop: '20px'
  }
};


class NetworkDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: props.settings.width,
      height: props.settings.height,
      defaultCommRange: props.settings.defaultCommRange,
      defaultTheta: props.settings.defaultTheta,
      useCommRange: props.settings.useCommRange,
      error: ''
    };
  }

  isValid = () => {
    const { width, height, defaultCommRange, defaultTheta } = this.state;
    const parsedWidth = parseInt(width, 10);
    const parsedHeight = parseInt(height, 10);
    const parsedCommRange = parseFloat(defaultCommRange);
    const parsedTheta = parseFloat(defaultTheta);

    if (isNaN(parsedWidth) || parsedWidth <= 0) {
      this.setState({ error: 'Invalid width. Width must be a positive integer.' });
      return false;
    }
    if (isNaN(parsedHeight) || parsedHeight <= 0) {
      this.setState({ error: 'Invalid height. Height must be a positive integer.' });
      return false;
    }
    if (isNaN(parsedCommRange) || parsedCommRange <= 0) {
      this.setState({ error: 'Invalid default communication range.' });
      return false;
    }
    if (isNaN(parsedTheta) || parsedTheta < 0 || parsedTheta > 360) {
      this.setState({ error: 'Invalid default theta value.' });
      return false;
    }

    return true;
  };

  save = () => {
    const { width, height, defaultCommRange, defaultTheta, useCommRange } = this.state;

    if (!this.isValid()) return;

    this.props.updateNetwork({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      defaultCommRange: parseFloat(defaultCommRange),
      defaultTheta: parseFloat(defaultTheta),
      useCommRange
    });
    this.props.closeModal();
  };

  render() {
    const { width, height, defaultCommRange, defaultTheta, useCommRange, error } = this.state;
    const { configurable } = this.props;
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
        title="Network settings"
        actions={actions}
        modal={false}
        autoScrollBodyContent
        open
        onRequestClose={this.props.closeModal}
      >
        { !!error && <div style={styles.errorMsg}>{error}</div> }
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Environment width"
          floatingLabelStyle={styles.textLabel}
          value={width}
          onChange={(e, text) => this.setState({ width: text })}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Environment height"
          floatingLabelStyle={styles.textLabel}
          value={height}
          onChange={(e, text) => this.setState({ height: text })}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Default communication range of new nodes"
          floatingLabelStyle={styles.textLabel}
          value={defaultCommRange}
          onChange={(e, text) => this.setState({ defaultCommRange: text })}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Default theta of the new nodes"
          floatingLabelStyle={styles.textLabel}
          value={defaultTheta}
          onChange={(e, text) => this.setState({ defaultTheta: text })}
        />
        <Toggle
          disabled={!configurable}
          label="Calculate edges depending on communication range"
          labelPosition="right"
          style={styles.toggle}
          toggled={useCommRange}
          onToggle={(e, value) => this.setState({ useCommRange: value })}
        />
      </Dialog>
    );
  }
}

NetworkDetails.propTypes = {
  settings: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    defaultCommRange: PropTypes.number,
    defaultTheta: PropTypes.number,
    useCommRange: PropTypes.bool
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  updateNetwork: PropTypes.func.isRequired,
  configurable: PropTypes.bool.isRequired
};

export default NetworkDetails;
