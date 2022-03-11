import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import './EditBook.css'
import Cookies from 'js-cookie'

export const EditBook = () => {

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
    withCredentials: true
  })

  // State to store edit book api request result
  const [editBookResponse, setEditBookResponse] = useState({
    success: '',
    msg: ''
  })

  const GetSearchParams = () => {
      const location = useLocation();
      console.log("location = " + location.search);
      console.log(new URLSearchParams(location));
  }

  let [searchParams, setSearchParams] = useSearchParams();

  // State to store info of the book that is being edited
  const [bookInfo, setBookInfo] = useState({
    // id: searchParams.get('id'),
    title: '',
    description: '',
    coverImage: ''
  });


  // Pass [] in the useEffect as a parameter to make request to 
  // API only once the state changes
  useEffect(async () => {
    // Any authorize user can edit this book.
    // So, so safe this api pass in the user ID as well as book ID.
    const bookID = searchParams.get('id');
    const response = await api.get(`/books/${bookID}/user/${Cookies.get('id')}`,
    Cookies.get('id'))
    .then(response => {
      console.log(response);

      if (response.status === 200) {
        console.log('edit success')
        const renderedBookInfo = response.data.book;
        setBookInfo(renderedBookInfo);
      } else if (response.status === 404 && response.data.success === false) {
        setEditBookResponse({ ...editBookResponse, 
          success: response.data.sucess, msg: response.data.msg });
        // Wait for 2 seconds before navigating to the profile page.
        setTimeout(() => { navigate('/profile') }, 2000);
      }
    })
    . catch(error => {
      setEditBookResponse({ ...editBookResponse, 
        success: false, msg: "An error occured while editing the book." });
        // Wait for 2 seconds before navigating to the profile page.
        setTimeout(() => { navigate('/profile') }, 2000);
    })
  }, []) 


  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    // To get values for each input field in the form
    setBookInfo({ ...bookInfo, [name] : value })
  }

  // Need to Check for incorrect book id update
  const handleSave = async (e) => {
    console.log("book info = ", bookInfo);

    const bookID = bookInfo.id;
    console.log('book id = '+ bookID)
    e.preventDefault();   // to prevent page refresh
    
    await api.put(`/books/${bookID}`, {
      title: bookInfo.title,
      description: bookInfo.description,
      coverImage: bookInfo.coverImage
    })
    .then(response => {
      if (response.status === 200 && response.data.success === true) {
        setEditBookResponse({ ...editBookResponse,  
          success: response.data.success, msg : response.data.msg });
        
        // Wait for 2 seconds before navigating to the profile page.
        setTimeout(() => { navigate('/profile') }, 2000);
      } else if (response.status === 400) {
        setEditBookResponse({ ...editBookResponse, msg : response.data.msg });
        setTimeout(() => { navigate('/profile') }, 2000);
      }
    })
    . catch(error => {
      setEditBookResponse({ ...editBookResponse, msg : error.response.data.msg });
      setTimeout(() => { navigate('/profile') }, 2000);
    })
  }

  const handleCancel = () => {
    navigate('/profile');
  }

  return (
    <div id="edit-book-container" >
      <form action="edit-book-form">
        <div id="edit-title-container">
            <input type="text" size="50"
            value={bookInfo.title} 
            onChange={handleInput} 
            name="title" id="edit-title" />
          </div>
          <div id="edit-description-container">
            <textarea type="text" rows="10" cols="80" 
            value={bookInfo.description} 
            onChange={handleInput} 
            name="description" id="edit-description" />
          </div>
          <div id="edit-cover-image-container">
            <input type="text" size="50"
            value={bookInfo.coverImage} 
            onChange={handleInput} 
            name="coverImage" id="edit-cover-image" />
          </div>
      </form>
      <div id="edit-book-result-msg-container">
        <p id="edit-book-result-msg" 
          style={{
            backgroundColor: editBookResponse.success === true ? 
            'green' : 'red',
            padding: editBookResponse.msg === '' ? '0' : '8px 16px 8px 16px'
          }}
        >
        { editBookResponse.msg }
        </p>
      </div>
      <button id="cancel-book-button" type="submit" 
      onClick={handleCancel}>Cancel</button>
      <button id="edit-book-button" type="submit" 
      onClick={handleSave}>Save</button>
    </div>
  )
}