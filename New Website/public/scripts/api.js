// This is like a helper function for "client-api.js".

// Points requests at your local server.
let API_URL = "/api";



/* Subclass of Error for representing HTTP errors returned from the API.
   Exposes a status (the HTTP response status code) and message (a user-facing message). */
export class HTTPError extends Error {
  /* status is the HTTP status, message is a user-facing error message. */
  constructor(status, message) {
    /* Call the Error constructor with the given message. */
    super(message);
    this.status = status;
  }
}

/* Make an API request.
   - method is the HTTP method.
   - path is the URI. It must begin with a /. API_URL will be prepended.
   - body (optional) is the request body as a JS object that can be converted to JSON.

   The API is assumed to return JSON. If the response status is 200, the response body (as a JS object) is returned.
   If the response has any other status, an HTTPError is thrown, with its status set to the response status and its
   message set to value of the "error" property of the response, which we assume is a user-facing error message. */
const apiRequest = async (method, path, body = null) => {
  let res;
  // Checks if API key is saved to the session storage.
  let API_KEY = sessionStorage.getItem('API_KEY');
  const isAdmin = (API_KEY !== null);
  if (body === null && !isAdmin) {
    res = await fetch(API_URL + path, {
      method: method,
      headers: {"Content-Type": "application/json"}
    });
  }
  else if (body !== null && !isAdmin) {
    res = await fetch(API_URL + path, {
      method: method,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });
  }
  else if (body === null && isAdmin) {
    res = await fetch(API_URL + path, {
      method: method,
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}`}
    });
  }
  else { // if (body !== null & API_KEY !== null)
    res = await fetch(API_URL + path, {
      method: method,
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}`},
      body: JSON.stringify(body)
    });
  }
  
  let data = await res.json();
  let status = res.status;

  if (status != 200) {
    throw new Error(data.error);
  }
  return data;
};

/* This line exposes the apiRequest function in the console, so you can call it for testing. */
window.apiRequest = apiRequest;

export default apiRequest;
