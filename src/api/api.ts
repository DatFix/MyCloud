import axios from "axios";

const API_URL = import.meta.env.VITE_MY_CLOUD_API;

// export const fetchData = async (enpoint:string) => {
//     try {
//         const response = await axios.get(`${API_URL}/${enpoint}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching data",error);
//         throw error;
//     }
// }

export const login = async (passcode:string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`,{passcode});
        return response.data;
    } catch (error) {
        console.error("Error fetching data",error);
        throw error;
    }
}

export const uploadFile = async (file: File) => {
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await axios.post('https://my-cloud-delta.vercel.app/drive/upload', formData, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('File upload failed');
    }
};

export const sendMessage = async (content: string) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post(`${API_URL}/note`, { content }, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Message send failed' + error);
    }
}


export const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/note`, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw new Error('Error fetching messages');
    }
}

export const fetchFiles = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/drive`, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        console.log("cook", response.data);
        
        return response.data;
    } catch (error) {
        throw new Error('Error fetching files');
    }

}


export const deleteFileOrMessage = async (fileId: string, id: string, type: 'file' | 'message') => {
  const token = localStorage.getItem('token');
  try {
    const endpoint = type === 'file' ? `${API_URL}/drive/delete/${fileId}` : `${API_URL}/note/${id}`;
    const response = await axios.delete(endpoint, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error deleting item');
  }
};
