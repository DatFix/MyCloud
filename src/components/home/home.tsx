import { useEffect, useRef, useState } from 'react';
import { Flex, Progress, Upload, Button } from 'antd';
import { CloudDownloadOutlined, DeleteOutlined, FileTextTwoTone, SendOutlined } from '@ant-design/icons';
import Img from '../../assets/images/image.png';
import Folder from '../../assets/images/folder.png';
import Others from '../../assets/images/orthers.png';
import Document from '../../assets/images/document.png';
import TextImage from '../../assets/images/text.png';
import Video from '../../assets/images/video.png';
import './home.css';
import useUploadFile from '../../hooks/useUpload';
import useSendMessage from '../../hooks/useSendMessage';
import useFetchMessage from '../../hooks/useFetchMessage';
import useFetchFiles from '../../hooks/useFetchFiles';
import fetchDriveStorage from '../../hooks/useFetchDriveStorage';
import useDeleteItem from '../../hooks/useDeleteNote';
import { message } from 'antd';
import { Image } from 'antd';




const Home = () => {
  const { upload, loading } = useUploadFile();
  const { handleSendMessage, isLoading: sendingMessage } = useSendMessage();
  const { fetchMessage, isLoading, messages } = useFetchMessage();
  const { fetchFilesData, files } = useFetchFiles();
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [storage, setStorage] = useState({
    limit: 0,
    usage: 0,
    usageInDriveTrash: 0,
  });
  console.log("storage", storage);
  

  useEffect(() => {
    const fetchStorage = async () => {
      const data = await fetchDriveStorage(); // Hàm fetchDriveStorage ở trên
      if (data) {
        setStorage(data);
      }
    };

    fetchStorage();
  }, []);

  const scrollToBottom = () => {
    // Add a small delay to ensure DOM is updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Modified customRequest function
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      const result = await upload(file);
      await fetchFilesData(); // Wait for files to be fetched
      onSuccess(result);
      scrollToBottom();
    } catch (error) {
      onError(error);
    }
  };

  // Modified handleSend function
  const handleSend = async () => {
    if (messageContent.trim()) {
      await handleSendMessage(messageContent);
      setMessageContent('');
      await fetchMessage(); // Wait for messages to be fetched
      scrollToBottom();
    }
  };

  // Add scroll to bottom when messages or files updat
  useEffect(() => {
    scrollToBottom();
  }, [messages, files]);

  // Initial data fetch and scroll
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchMessage(), fetchFilesData()]);
      scrollToBottom();
    };
    initializeData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const { handleDeleteItem, isDeleting } = useDeleteItem();

  // Thêm hàm xóa
  const onDelete = async (fileId: string, id: string, type: 'file' | 'message') => {
    await handleDeleteItem(fileId, id, type);
    message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
    if (type === 'file') {
      await fetchFilesData();
    } else {
      await fetchMessage();
    }
  };


  const handleDownload = async (fileId: string) => {
    try {
      setIsDownloading(true);
      const downloadLink = document.createElement('a');
      downloadLink.href = `https://drive.google.com/uc?export=download&id=${fileId}`;
      downloadLink.setAttribute('download', '');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Download error:', error);
      message.error('Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="home-container">
      <h2>My Cloud Storage</h2>
      <p className='storage'>Used: 4.9GB of 15GB</p>
      <Flex vertical gap="middle">
        <Progress percent={24} size={[1000, 15]} status="active" strokeColor={{ from: '#108ee9', to: '#87d068' }} />
      </Flex>

      <div className="statistic">
        <div className="statistic_card">
          <p className="card_title">Images</p>
          <div className="card_content">
            <img src={Img} alt="Statistics" />
            <p className="statistic_number">5</p>
          </div>
        </div>

        <div className="statistic_card">
          <p className="card_title">Documents</p>
          <div className="card_content">
            <img src={Folder} alt="Statistics" />
            <p className="statistic_number">5</p>
          </div>
        </div>

        <div className="statistic_card">
          <p className="card_title">Others</p>
          <div className="card_content">
            <img src={Others} alt="Statistics" />
            <p className="statistic_number">5</p>
          </div>
        </div>

      </div>

      <div className="recent-files">
        <h3></h3>
        <div className="recent-files-list" style={{ maxHeight: '25rem', overflowY: 'auto' }}>
          {isLoading ? (
            <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
          ) : (
            (() => {
              const combined = [
                ...(Array.isArray(messages) ? messages.map(msg => ({fileId: msg.driveFileId, id: msg._id, content: msg.content, createdAt: msg.createdAt, mimeType: msg.mimeType, fileLink: msg.fileLink, type: 'message' })) : []),
                ...(Array.isArray(files) ? files.map(file => ({fileId: file.driveFileId, id: file._id, content: file.name, createdAt: file.createdAt, mimeType: file.mimeType, fileLink: file.fileLink,  type: 'file' })) : []),
              ];
              
              combined.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

              return combined.map((item, index) => (
                <div key={index} className="message-item">
                  {item.mimeType?.split('/')[0] === 'image' ? (
                    <Image
                      src={item.fileLink}
                    />
                  ) : item.mimeType?.split('/')[0] === 'video' ? (
                    <div style={{ display: 'grid', alignItems: 'center', justifyContent: 'center', gridTemplateColumns: 'auto 1fr', gap: '1rem' }}>
                      <img src={Video} alt="file" style={{width: "50px"}} />
                      <p>{item.content}</p>
                    </div>
                  ) : item.mimeType?.split('/')[0] === 'application' ? (
                    <div style={{ display: 'grid', alignItems: 'center', justifyContent: 'center', gridTemplateColumns: 'auto 1fr', gap: '1rem' }}>
                      <img src={Document} alt="file" style={{width: "50px"}} />
                      <p>{item.content}</p>
                    </div>
                  ) : item.mimeType?.split('/')[0] === 'text' ? (
                    <div style={{ display: 'grid', alignItems: 'center', justifyContent: 'center', gridTemplateColumns: 'auto 1fr', gap: '1rem' }}>
                      <img src={TextImage} alt="file" style={{width: "50px"}} />
                      <p>{item.content}</p>
                    </div>
                  ) : (
                    <>
                      <li>{item.content}</li>

                      
                    </>
                  )
                  }
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <small>{formatDate(item.createdAt)}</small>
                    <div style={{ display: 'flex', }}>
                    {item.fileId && (
                      <Button
                        type="text"
                        icon={isDownloading ? null : <CloudDownloadOutlined />}
                        loading={isDownloading}
                        style={{
                          marginLeft: '10px',
                          outline: 'none',
                          background: 'none',
                          border: 'none',
                          fontSize: '1.2rem',
                          color: '#1890ff',
                        }}
                        onClick={() => handleDownload(item.fileId)}
                    />
                    )}
                    <Button
                      type="text"
                      danger
                      icon={isDeleting ? null : <DeleteOutlined />}
                      loading={isDeleting} // Hiển thị trạng thái xóa
                      onClick={() => onDelete(item.fileId ,item.id, item.type as 'file' | 'message')} 
                      style={{ marginLeft: '10px', outline: 'none', background: 'none', border: 'none' , fontSize: '1.2rem', }}
                    >
                    </Button>
                    </div>
                    
                  </ div>
                </div>

              ));
            })()
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-box">
          <Upload
            customRequest={customRequest}
            showUploadList={false}
          >
            <Button
              icon={<FileTextTwoTone style={{ fontSize: '1.5rem' }} />}
              loading={loading}
              style={{
                border: 'none',
                background: 'none',
                outline: 'none',
                boxShadow: 'none',
              }}
            >
              {loading ? 'Uploading...' : ''}
            </Button>
          </Upload>

          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message..."
          />
          <Button
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={sendingMessage}
            style={{
              border: 'none',
              background: 'none',
              outline: 'none',
              boxShadow: 'none',
              fontSize: '1.5rem',
              margin: 'auto',
              color: '#1890ff',
            }}
          >
            {sendingMessage ? '' : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;