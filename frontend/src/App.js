import { UserRegistrationForm } from './component/UserRegistrationForm'
import { Login } from './component/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Profile } from './component/Profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<UserRegistrationForm />} />
          <Route path='/profile/*' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
