import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route } from 'react-router-dom'; // Sử dụng Routes và Route thay vì BrowserRouter
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/components/login/login';
import GiaoDienChinh from '../src/components/list/list';
import App from './App';
import { SearchProvider } from './components/lib/searchContext'; // Import SearchProvider
import { SelectedGroupProvider } from './components/ChatRoom/SelectedGroupContext';
import { IsUserProvider } from './components/lib/IsUserContext';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
  <BrowserRouter>
  
  <SelectedGroupProvider>
  <SearchProvider>
  <IsUserProvider>
  <Routes>
    <Route path='/' element={<App />} />
    <Route path='/login' element={<Login />} />
  </Routes>
  </IsUserProvider>
  </SearchProvider>
  </SelectedGroupProvider>

  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

