const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const fetchDriveStorage = async () => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/about?fields=storageQuota',
        {
          headers: {
            Authorization: `${ACCESS_TOKEN}`, 
          },
        }
      );
      console.log("ACCESS_TOKEN", ACCESS_TOKEN);
      
  
      if (!response.ok) {
        throw new Error('Failed to fetch storage info');
      }
  
      const data = await response.json();
      console.log("data", data.storageQuota);
      return data.storageQuota;
    } catch (error) {
      console.error('Error fetching Google Drive storage:', error);
    }
  };
export default fetchDriveStorage;