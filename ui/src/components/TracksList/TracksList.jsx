import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './TracksList.module.css';
import Car from '../Car/Car';

class TracksList extends Component {
  render() {
    const {
      tracks,
      onCarDelete,
      onDelete
    } = this.props;

    return (
      <div className={styles.tasks}>
        <h3>Tracks list</h3>
        <div className={styles.list}>
          {
            tracks.map(track => (
              <div className={styles.task}>
                <div>{`Name: ${track.name}`}</div>
                <div>{`Description: ${track.description}`}</div>
                <div>{`Length: ${track.length.value} ${track.length.unit}`}</div>

                <h3>Cars</h3>
                {
                  track.cars.map(car => (
                    <Car {...car} style={{ marginTop: 10 }} onDelete={() => onCarDelete(track._id, car._id)} />
                  ))
                }
                <button onClick={() => onDelete(track._id)}>Add car</button>
                <button onClick={() => onDelete(track._id)}>Delete track</button>
              </div>
            ))
          }
        </div>
        <div className={styles.actions}>
          <button>Add new task</button>
        </div>
      </div>
    );
  }
}

TracksList.propTypes = {
  onCarDelete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
TracksList.defaultProps = {};

export default TracksList;
