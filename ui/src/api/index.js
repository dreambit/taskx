const apiBase = 'http://localhost:3000';

function checkStatus(res) {
  if (res.ok) {
    return res;
  } else {
    throw new Error(res.statusText);
  }
}

export function getCars() {
  return fetch(`${apiBase}/cars`).then(checkStatus).then(resp => resp.json());
}

export function getTracks(search) {
  return fetch(`${apiBase}/tracks?search=${search}`).then(checkStatus).then(resp => resp.json());
}

export function deleteTrack(id) {
  return fetch(`${apiBase}/tracks/${id}`, {
      method: 'DELETE'
    })
    .then(checkStatus)
}

export function addCar(car) {
  return fetch(`${apiBase}/cars`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(car)
  })
    .then(checkStatus)
    .then(resp => resp.json());
}

export function deleteCar(id) {
  return fetch(`${apiBase}/cars/${id}`, {
    method: 'DELETE'
  })
    .then(checkStatus)
}

export function deleteCarFromTrack(trackId, carId) {
  return fetch(`${apiBase}/tracks/${trackId}/cars/${carId}`, {
    method: 'DELETE'
  })
    .then(checkStatus)
}


