import { useState } from 'react';
import { uploadFile } from '../api/api';
import { message } from 'antd';

const useUploadFile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const upload = async (file: File) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await uploadFile(file);
            message.success(`${file.name} file uploaded successfully`);
            return response;
        } catch (error) {
            const errorMessage = (error as Error).message;
            setError(errorMessage);
            message.error(`${file.name} file upload failed.`);
            throw error; // Rethrow to handle in the component
        } finally {
            setLoading(false);
        }
    };
    
    return { upload, loading, error };
};

export default useUploadFile;