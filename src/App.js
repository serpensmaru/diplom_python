import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header'
import File from './components/File';
import Files from './components/Files';
import Auth from './components/Auth';
import AdminFiles from './components/AdminFiles';
import AdminUsers from './components/AdminUsers';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute />}>
          <Route path='/' element={
            <>
              <Header />
              <Files>
                <File />
              </Files>
            </>
          } />
        </Route>
        <Route path='/admin' element={
          <>
            <Header />
            <AdminRoute />
          </>}>
          <Route path='/admin/users' element={<AdminUsers />} />
          <Route path='/admin/files' element={<AdminFiles />} />
        </Route>
        <Route path='/login' element={<Auth action={'signin'} />}></Route>
        <Route path='/signup' element={<Auth action={'signup'} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
