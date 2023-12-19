
const SpotifyAuth = () => {
  const handleAuthorize = async () => {
    try {
      const response = await fetch('/authorize', {
        method: 'GET',
      });

      if (response.ok) {
        const locationHeader = response.headers.get('location');
        if (locationHeader) {

          window.location.href = locationHeader;
          return response
        }
      } else {
        console.error('Authorization request failed');
      }
    } catch (error) {
      console.error('Error during authorization request:', error);
    }
  };

  return (
    <div>
      <button onClick={handleAuthorize}>Authorize</button>
    </div>
  );
};

export default SpotifyAuth