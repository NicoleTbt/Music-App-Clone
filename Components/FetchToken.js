
// Importing Buffer from the 'buffer' library
import { Buffer } from 'buffer';

// Define a function to fetch the Spotify API token
const FetchToken = async (client_id, client_secret) => {
  try {
    // Combine client_id and client_secret and encode to base64
    const credentials = `${client_id}:${client_secret}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    // Make a POST request to Spotify API for the token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    // Check for non-successful HTTP status code
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching token:', errorData);
      // Handle error, throw an exception, or take appropriate action
      throw new Error('Failed to fetch token');
    }

    // Parse the response JSON and return the access_token
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    // Log and re-throw any errors that occur during the fetch
    console.error('Error fetching token:', error);
    throw error;
  }
};



export default FetchToken;

