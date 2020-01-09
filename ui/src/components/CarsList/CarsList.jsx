import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Car from '../Car/Car';

import styles from './CarsList.module.css';

class CarsList extends Component {
  state = {
    editItem: undefined
  }

  handleAddCarClick = () => {
    this.setState({
      editItem: {
        "code": "abc1",
        "transmission": "manual",
        "ai": true,
        "maxSpeed": {
          "unit": "mps",
          "value": 102
        }
      }
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

    onAdd(editItem);
  }

  handleCodeChange = (evt) => {
    this.setState({
      editItem: {
        ...this.state.editItem,
        code: evt.target.value
      }
    })
  }

  handleTransmissionChange = (evt) => {
    this.setState({
      editItem: {
        ...this.state.editItem,
        transmission: evt.target.value
      }
    })
  }

  handleAIChange = () => {
    this.setState({
      editItem: {
        ...this.state.editItem,
        ai: !this.state.editItem.ai
      }
    })
  }

  handleMaxSpeedValueChange = (evt) => {
    this.setState({
      editItem: {
        ...this.state.editItem,
        maxSpeed: {
          ...this.state.editItem.maxSpeed,
          value: Number(evt.target.value)
        }
      }
    })
  }

  handleMaxSpeedUnitChange = (evt) => {
    this.setState({
      editItem: {
        ...this.state.editItem,
        maxSpeed: {
          ...this.state.editItem.maxSpeed,
          unit: evt.target.value
        }
      }
    })
  }

  handleCancel = () => {
    this.setState({
      editItem: undefined
    });
  }

  render() {
    const {
      cars,
      onDelete
    } = this.props;

    const {
      editItem
    } = this.state;

    return (
      <div className={styles.cars}>
        <h3>Cars list</h3>
        {
          editItem ? (
            <div className={styles.editor}>
              <div>
                <label>Code</label>
                <input type="text" value={editItem && editItem.code} onChange={this.handleCodeChange} />
              </div>
              <div>
                <label>Transmission</label>
                <select value={editItem && editItem.transmission} onChange={this.handleTransmissionChange}>
                  <option value="manual">manual</option>
                  <option value="automatic">automatic</option>
                </select>
              </div>
              <div>
                <label>AI</label>
                <input type="checkbox" onChange={this.handleAIChange} checked={editItem && editItem.ai} />
              </div>
              <div>
                <label>Max speed</label>
                <input type="number" value={editItem && editItem.maxSpeed.value} onChange={this.handleMaxSpeedValueChange} />
                <select value={editItem && editItem.maxSpeed.unit} onChange={this.handleMaxSpeedUnitChange}>
                  <option value="manual">mps</option>
                </select>
              </div>
              <button onClick={this.handleAddClick}>Add</button>
              <button onClick={this.handleCancel}>Cancel</button>
            </div>
          ) : (
            <>
              <div className={styles.list}>
                {
                  cars.map(car => (
                    <Car key={car._id} {...car} style={{ marginRight: 10 }} onDelete={() => onDelete(car._id)} />
                  ))
                }
              </div>
              <div className={styles.actions}>
                <button onClick={this.handleAddCarClick}>Add new car</button>
              </div>
            </>
          )
        }
      </div>
    );
  }
}

CarsList.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
};
CarsList.defaultProps = {};

export default CarsList;
