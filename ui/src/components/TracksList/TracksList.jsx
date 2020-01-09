import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './TracksList.module.css';
import Car from '../Car/Car';

class TracksList extends Component {
  state = {
    editItem: undefined,
    selectedCar: undefined,
  }

  handleAddTrackClick = () => {
    const {
      cars
    } = this.props;

    this.setState({
      editItem: {
        "name": "Millbrook",
        "description": "Millbrook city course race track",
        "length": {
          "unit": "km",
          "value": 8
        },
        cars: []
      },
      selectedCar: cars.length > 0 && cars[0]._id
    })
  }

  handleAddClick = () => {
    const {
      onAdd
    } = this.props;

    const {
      editItem
    } = this.state;

    this.setState({
      editItem: undefined
    });

    onAdd({
      ...editItem,
      cars: editItem.cars.map(c => c._id)
    });
  }

  handleNameChange = (evt) => {
    this.setState({
      editItem: {
        ...this.state.editItem,
        name: evt.target.value
      }
    })
  }

  handleDescriptionChange = (evt) => {
    this.setState({
      editItem: {
        ...this.state.editItem,
        description: evt.target.value
      }
    })
  }

  handleLengthValueChange = (evt) => {
    this.setState({
      editItem: {
        ...this.state.editItem,
        length: {
          ...this.state.editItem.length,
          value: Number(evt.target.value)
        }
      }
    })
  }

  handleLengthUnitChange = (evt) => {
    this.setState({
      editItem: {
        ...this.state.editItem,
        length: {
          ...this.state.editItem.length,
          unit: evt.target.value
        }
      }
    })
  }

  handleSelectedCarChange = (evt) => {
    this.setState({
      selectedCar: evt.target.value
    })
  }

  handleCancel = () => {
    this.setState({
      editItem: undefined
    });
  }

  handleAddCarClick = () => {
    const {
      cars
    } = this.props;

    const {
      selectedCar,
      editItem
    } = this.state;

    const car = cars.find(c => c._id === selectedCar);
    const nextAvailable = cars.filter(c => !editItem.cars.some(ec => ec._id === c._id) && c._id !== selectedCar);

    this.setState({
      editItem: {
        ...editItem,
        cars: [...editItem.cars, car]
      },
      selectedCar: nextAvailable.length > 0 ? nextAvailable[0]._id : undefined
    })
  }

  render() {
    const {
      tracks,
      cars,
      onCarDelete,
      onDelete
    } = this.props;

    const {
      editItem,
      selectedCar
    } = this.state;

    const availableCars = cars.filter(c => editItem && !editItem.cars.some(ec => ec._id === c._id));

    console.log(availableCars, editItem && editItem.cars);

    return (
      <div className={styles.tasks}>
        <h3>Tracks list</h3>
        {
          editItem ? (
            <div className={styles.editor}>
              <div>
                <label>Name</label>
                <input type="text" value={editItem && editItem.name} onChange={this.handleNameChange} />
              </div>
              <div>
                <label>Description</label>
                <input type="text" value={editItem && editItem.description} onChange={this.handleDescriptionChange} />
              </div>
              <div>
                <label>Length</label>
                <input type="number" value={editItem && editItem.length.value} onChange={this.handleLengthValueChange} />
                <select value={editItem && editItem.length.unit} onChange={this.handleLengthUnitChange}>
                  <option value="manual">km</option>
                </select>
              </div>
              <div>
                <label>Cars</label>
                <div style={{ margin: 20 }}>
                  {
                    editItem && editItem.cars.map(c => (
                      <div key={c._id}>{c.code}</div>
                    ))
                  }
                </div>
                <select value={selectedCar} onChange={this.handleSelectedCarChange}>
                  {
                    availableCars.map(c => (
                      <option key={c._id} value={c._id}>{c.code}</option>
                    ))
                  }
                </select>
                {
                  availableCars.length > 0 && (
                    <button onClick={this.handleAddCarClick} style={{ marginLeft: 10 }}>Add</button>
                  )
                }
              </div>
              <div style={{ marginTop: 20 }}>
                <button onClick={this.handleAddClick}>Add</button>
                <button onClick={this.handleCancel}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
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
                      <button onClick={() => onDelete(track._id)}>Delete track</button>
                    </div>
                  ))
                }
              </div>
              <div className={styles.actions}>
                <button onClick={this.handleAddTrackClick}>Add new task</button>
              </div>
            </>
          )
        }
      </div>
    );
  }
}

TracksList.propTypes = {
  cars: PropTypes.array,
  onCarDelete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
};
TracksList.defaultProps = {};

export default TracksList;
