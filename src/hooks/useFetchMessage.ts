import { useState } from 'react';
import { fetchMessages} from '../api/api';

const useFetchMessage = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessage] = useState<string | null>(null);

    const fetchMessage = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchMessages();
            setMessage(data);
        } catch (error) {
            console.error('There was a problem with the fetch message operation:', error);
            setError('Fetch message failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
    return { fetchMessage, error, isLoading, messages };
}
export default useFetchMessage;