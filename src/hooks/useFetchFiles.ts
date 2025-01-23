import { useState } from 'react';
import { fetchFiles} from '../api/api';

const useFetchFiles = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<string | null>(null);

    const fetchFilesData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchFiles();
            setFiles(data);
        } catch (error) {
            console.error('There was a problem with the fetch message operation:', error);
            setError('Fetch message failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
       
        
    }
    return { fetchFilesData, error, isLoading, files};
}
export default useFetchFiles;