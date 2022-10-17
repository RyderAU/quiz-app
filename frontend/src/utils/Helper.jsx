const config = require('../config.json');

const url = `http://localhost:${config.BACKEND_PORT}/`;

// const getJSON = async (path, options) =>
//   // eslint-disable-next-line implicit-arrow-linebreak
//   new Promise((resolve, reject) => {
//     fetch(path, options).then((res) => {
//       if (res.status === 200) {
//         resolve(res.json());
//       } else {
//         res.json().then((err) => {
//           reject(err.error);
//         });
//       }
//     });
//   });

const getJSON = async (path, options) => {
  const res = await fetch(path, options);
  const resData = await res.json();
  if (res.status !== 200) {
    throw new Error(resData.error);
  }
  return resData;
};

// no authorization required
export const unauthAPIget = (path, body, method) => {
  let options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method,
  };
  if (body != null) {
    options = { ...options, body: JSON.stringify(body) };
  }
  return getJSON(url + path, options);
};

// authorization required
export const authAPIget = (path, body, method) => {
  const { token } = JSON.parse(window.localStorage.getItem('token'));
  let options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method,
  };
  if (body != null) {
    options = { ...options, body: JSON.stringify(body) };
  }
  return getJSON(url + path, options);
};

// function from ass2
export function fileToDataUrl(file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}
