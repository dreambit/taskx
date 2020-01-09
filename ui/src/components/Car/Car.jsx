import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Car.module.css';

class Car extends Component {
  render() {
    const {
      transmission,
      ai,
      code,
      maxSpeed: {
        value,
        unit
      },
      style,
      onDelete
    } = this.props;

    return (
      <div className={styles.car} style={style}>
        <div>{`Code: ${code}`}</div>
        <div>{`Transmission: ${transmission}`}</div>
        <div>{`AI: ${ai ? 'enabled' : 'disabled'}`}</div>
        <div>{`Max speed: ${value} ${unit}`}</div>
        <button onClick={onDelete}>Delete</button>
      </div>
    );
  }
}

Car.propTypes = {
  _id: PropTypes.string.isRequired,
  transmission: PropTypes.oneOf(['automatic', 'manual']).isRequired,
  ai: PropTypes.bool.isRequired,
  maxSpeed: PropTypes.shape({
    unit: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired
};
Car.defaultProps = {};

export default Car;
