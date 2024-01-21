import { Buffer } from 'buffer';



const SearchTrack = async (query, token) => {
  const refreshToken = token;

  const refreshAccessToken = async (refreshToken) => {
    const clientSecret = '7c3263f4d4164128b0429001b1431249';
    const clientId = '4f46b4861d9f4fa4b03c5a209fb49549';
    try {
      const credentials = `${clientId}:${clientSecret}`;
      const encodedCredentials = Buffer.from(credentials).toString('base64');
  
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      });
  
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  try {
    console.log('token:', token);
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    console.log('After fetch');

   // If the request returns unauthorized, attempt to refresh the token and retry the search
   if (response.status === 401) {
    const newAccessToken = await refreshAccessToken(refreshToken);

    // Retry the search with the new access token
    const retryResponse = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      headers: {
        Authorization: 'Bearer ' + newAccessToken,
      },
    });

    const data = await retryResponse.json();
    return data.tracks.items;
  }

  const data = await response.json();
  return data.tracks.items;
} catch (error) {
  console.error('Error in SearchTrack:', error);
  throw error;
}
};
export { SearchTrack };