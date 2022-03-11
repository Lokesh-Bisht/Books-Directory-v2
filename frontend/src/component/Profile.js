import { React, useState, useEffect } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { AddBook } from './books/AddBook';
import { UserBooks } from './books/UserBooks';
import { EditBook } from './books/EditBook';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Profile.css'


const Avatar = (props) => {

  const navigate = useNavigate();

  // Check if the user loggged out
  useEffect( () => {
    const accessToken = Cookies.get('Authorization');
    if (!accessToken) {
      navigate('/');
    } 
  })

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
    withCredentials: true,
    // headers: {
    //   Authorization: `Bearer ${accessToken}`,
    // }
  })

  const [user, setUser] = useState(null);
  const [requestError, setRequestError] = useState([]);

  const userInfoResponse = useEffect( async () => {    
      const response = await api.get(`/users/${Cookies.get('id')}`,
        Cookies.get('id'))
        .then(response => {
        console.log(response.data);
        const renderedUserInfo = response.data
        setUser(renderedUserInfo);
      })
      . catch(error => {
        console.log("Inside error");
        // return error;
        // setRequestError("Failed to fetch user info.");
      })
  }, []);

  

  const handleLogout = (e) => {
    e.preventDefault(); // to stop the page from reloading when button is clicked
    Cookies.remove('id');
    Cookies.remove('Authorization');
    navigate('/');
  }


  const DropDown = () => {
    return (
      <div id="avatar-dropdown-items">
          <p id="username-container">{user?.username}</p>
          <p id="email-profile">{user?.email}</p>
          <p>
            <a id="logout" href="" onClick={handleLogout}>Logout</a>
          </p>
      </div>
    )
  }

  return (    
    <div id="avatar-dropdown" style={{
      display: props.data === true ? "block" : "none",
    }}>
      <DropDown />
    </div>
    
  )

}



const Navbar = () => {

  const [click, setClick] = useState(false);

  const handleAvatarIconClick = () => setClick(!click)

  return (
    <div>

      <Link to="/profile" id="home" 
      onClick={() => { setClick(false) }} >Home</Link>

      <Link to="/profile/books/add" id="add-books"
      onClick={() => { setClick(false) }} >Add a new book</Link>

      <Link to="/profile/books" 
      onClick={() => { setClick(false) }} >Your books</Link>
      
       {/* <Link to="/books/showAll">Show all books</Link> */}

      <Link to="#" id="avatar" onClick={handleAvatarIconClick} >Settings
        <Avatar data={ click ? true: false } />
      </Link>
    </div>
  )
}


const RoutePaths = () => {
  return (
      <Routes>
        <Route path="/" />
        <Route path="/books/add" element={<AddBook />} />
        <Route path='/books/' element={<UserBooks />} />
        <Route path = '/books/edit/query' element={<EditBook/>} />
        {/* <Route path="/books/showAll" element={<ShowAllBook />} /> */}
      </Routes>
  )
}



export const Profile = () => {

  return (
    <div id="global-container">
      <div id="nav-bar">
        <Navbar /> 
      </div>
      <div id="books-container">
        <RoutePaths /> 
      </div>
    </div>
  )
}