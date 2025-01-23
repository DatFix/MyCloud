import { useState } from "react";
import { sendMessage } from "../api/api";

export const useSendMessage = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (content: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await sendMessage(content);
            console.log('Message sent successfully');
        } catch (error) {
            console.error('There was a problem with the send message operation:', error);
            setError('Message send failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
    return { handleSendMessage, error, isLoading };
}
export default useSendMessage;