import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import { Space, Switch } from 'antd';
import AppRoute from './Routes/AppRoute';
import SunIcon from './assets/images/sun.png';
import MoonIcon from './assets/images/moon.png';
import './App.css'

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  };

  return (
    <ConfigProvider theme={darkMode ? { token: { colorBgBase: '#000000' } } : {}}>
      <Space direction="vertical">
      <Switch
        checked={darkMode}
        checkedChildren={<img src={MoonIcon} alt="Dark Mode" style={{ width: 20, height: 20 }} />}
        unCheckedChildren={<img src={SunIcon} alt="Light Mode" style={{ width: 22, height: 22, marginTop: -3}} />}
        onChange={toggleDarkMode}
        tabIndex={-1}
        style={{
          backgroundColor: darkMode ? '#666464' : '#7ab9f5', 
          borderColor: darkMode ? '#666464' : '#d9d9d9', 
        }}
      />
    </Space>
      <AppRoute />
    </ConfigProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
export default App;
