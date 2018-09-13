import * as PropTypes from 'prop-types';
import * as React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import styles from './style';

function NodeInfo({ node: { id, x, y, theta, commRange, memory, status, inbox, outbox } }) {
  return (
    <Paper zDepth={2} style={styles.nodeInfoContainer}>
      <TextField
        disabled
        fullWidth
        floatingLabelText="Id"
        value={id}
      />
      <TextField
        disabled
        style={styles.leftTextField}
        floatingLabelText="X position"
        floatingLabelStyle={styles.textFieldLabel}
        value={x}
      />
      <TextField
        disabled
        style={styles.rightTextField}
        floatingLabelText="Y position"
        floatingLabelStyle={styles.textFieldLabel}
        value={y}
      />
      <TextField
        disabled
        style={styles.leftTextField}
        floatingLabelText="Theta"
        floatingLabelStyle={styles.textFieldLabel}
        value={theta}
      />
      <TextField
        disabled
        style={styles.rightTextField}
        floatingLabelText="Communication range"
        floatingLabelStyle={styles.textFieldLabel}
        value={commRange}
      />
      <TextField
        disabled
        fullWidth
        floatingLabelText="Status"
        floatingLabelStyle={styles.textFieldLabel}
        value={status || ' '}
      />
      <TextField
        disabled
        fullWidth
        floatingLabelText="Memory"
        floatingLabelStyle={styles.textFieldLabel}
        multiLine
        rows={5}
        value={JSON.stringify(memory, null, 2)}
      />
      <TextField
        disabled
        fullWidth
        floatingLabelText="Inbox"
        floatingLabelStyle={styles.textFieldLabel}
        multiLine
        rows={5}
        value={inbox.join()}
      />
      <TextField
        disabled
        fullWidth
        floatingLabelText="Outbox"
        floatingLabelStyle={styles.textFieldLabel}
        multiLine
        rows={5}
        value={outbox.join()}
      />
    </Paper>
  );
}

NodeInfo.propTypes = {
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
  }).isRequired
};

export default NodeInfo;
