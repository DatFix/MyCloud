import { useState } from 'react';
import { deleteFileOrMessage } from '../api/api'; 

const useDeleteItem = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteItem = async (fileId:string, id: string, type: 'file' | 'message') => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteFileOrMessage(fileId, id, type);
    } catch (err: any) {
      setError(err.message || 'Error deleting item');
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDeleteItem, isDeleting, error };
};

export default useDeleteItem;
