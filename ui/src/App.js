import React, { Component } from 'react';
import './App.css';
import { addCar, deleteCar, deleteCarFromTrack, deleteTrack, getCars, getTracks } from './api';
import CarsList from './components/CarsList/CarsList';
import TracksList from './components/TracksList/TracksList';

class App extends Component {
  state = {
    cars: [],
    tracks: [],
    search: ''
  };

  componentDidMount() {
    Promise.all([getCars(), getTracks('')])
      .then(([cars, tracks]) => this.setState({cars, tracks}));
  }

  handleInputChange = (evt) => {
    const search = evt.target.value;

    this.setState({
      search
    });

    getTracks(search).then(tracks => this.setState({ tracks }));
  }

  handleCarAdd = (car) => {
    const {
      cars
    } = this.state;

    addCar(car).then((newCar) => {
      this.setState({
        cars: [...cars, newCar]
      });
      console.log(`Car ${newCar._id} was added`);
    }).catch(() => console.log(`Ups...`));
  }

  handleCarDelete = (id) => {
    const {
      cars
    } = this.state;

    deleteCar(id).then(() => {
      this.setState({
        cars: cars.filter(c => c._id !== id)
      });
      console.log(`Car ${id} was deleted`);
    }).catch(() => console.log(`Ups...`));
  }

  handleDeleteCarFromTrack = (taskId, carId) => {
    const {
      tracks
    } = this.state;

    deleteCarFromTrack(taskId, carId).then(() => {
      this.setState({
        tracks: tracks.map(track => {
          if (track._id !== taskId) {
            return track;
          }

          return {
            ...track,
            cars: track.cars.filter(c => c._id !== carId)
          }
        })
      });
      console.log(`Car ${carId} was deleted from track ${taskId}`);
    }).catch(() => console.log(`Ups...`));
  }

  handleTrackDelete = (id) => {
    const {
      tracks
    } = this.state;

    deleteTrack(id).then(() => {
      this.setState({
        tracks: tracks.filter(t => t._id !== id)
      });
      console.log(`Track ${id} was deleted`);
    }).catch(() => console.log(`Ups...`));
  }

  render() {
    const {
      cars,
      tracks,
      search
    } = this.state;

    return (
      <div className="App">
        <input type="text" placeholder="Search for track" value={search} onChange={this.handleInputChange} />
        <CarsList cars={cars} onAdd={this.handleCarAdd} onDelete={this.handleCarDelete} />
        <TracksList tracks={tracks} onDelete={this.handleTrackDelete} onCarDelete={this.handleDeleteCarFromTrack} />
      </div>
    );
  }
}

App.propTypes = {};
App.defaultProps = {};

export default App;

