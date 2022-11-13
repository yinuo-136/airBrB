const baseUrl = 'http://localhost:' + 5006;

// transfer file to dataurl
export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    alert('provided file is not a png, jpg or jpeg image.');
    return;
  }
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

// navigate to a certain route
export const navTo = (nav, route) => {
  nav(route)
}

// helper function to make server request faster
export const makeRequest = async (path, methods, body, token) => {
  const option = {
    method: methods,
    headers: {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + token
    },
  };
  if (body !== undefined) {
    option.body = JSON.stringify(body);
  }

  const response = await fetch(baseUrl + path, option);
  const data = await response.json();
  if (data.error) {
    alert(data.error);
  } else {
    return data;
  }
}
