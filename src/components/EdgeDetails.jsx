import * as PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';

const styles = {
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

class EdgeDetails extends React.Component {
  remove = () => this.props.deleteEdge(this.props.edge);

  renderTitle = () => (
    <div style={styles.modalTitleContainer}>
      <p style={styles.modalTitle}>Edge details</p>
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
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.closeModal}
      />
    ];

    return (
      <Dialog
        title={this.renderTitle()}
        actions={actions}
        modal={false}
        autoScrollBodyContent
        open
        onRequestClose={this.props.closeModal}
      >
        <TextField
          disabled
          fullWidth
          floatingLabelText="From"
          floatingLabelStyle={styles.textLabel}
          value={this.props.edge[0].id}
        />
        <TextField
          disabled
          fullWidth
          floatingLabelText="To"
          floatingLabelStyle={styles.textLabel}
          value={this.props.edge[1].id}
        />
      </Dialog>
    );
  }
}

EdgeDetails.propTypes = {
  edge: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number
  })).isRequired,
  closeModal: PropTypes.func.isRequired,
  deleteEdge: PropTypes.func.isRequired,
  configurable: PropTypes.bool.isRequired
};

export default EdgeDetails;
