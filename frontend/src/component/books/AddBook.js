import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie';
import './AddBook.css';
import { useNavigate } from 'react-router-dom'

export const AddBook = () => {

  const navigate = useNavigate();

  // State to store add book api request result
  const [addBookResponse, setAddBookResponse] = useState({
    success: '',
    msg: ''
  })

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
    withCredentials: true // To send the saved cookies with every client request to the server
  })

  const [book, setBook] = useState({
    title: '',
    description: '',
    coverImage: ''
  })

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    // To get values for each input field in the form
    setBook({ ...book, [name] : value });
  }


  const handleSubmit = async (e) => {
    
    e.preventDefault();

    console.log("id = " + Cookies.get('id'));

    try {
      const response = await api.post('/books/new', {
        userID: Cookies.get('id'),
        title: book.title,
        description: book.description,
        coverImage: book.coverImage
      })

      if (response.status === 200 && response.data.success === true) {
        // redirect the user to the profile page.
        console.log(response);
        console.log(response.data);
        console.log(response.data.msg);
        // setAddBookResponse(response.data);
        setAddBookResponse({ ...addBookResponse,  
          success: response.data.success, msg : response.data.msg });
        // Wait for 2 seconds before navigating to the profile page.
        setTimeout(() => { navigate('/profile') }, 2000);
      } else if (response.status === 400) {
        setAddBookResponse({ ...addBookResponse, msg : response.data.msg });
      }
    } catch(error) {
      console.log(error.response.data.msg);
      setAddBookResponse({ ...addBookResponse, msg : error.response.data.msg });
      // alert("You're logged out. Please log in again.");
    }
  }

  const handleCancel = () => {
    navigate('/profile');
  }

  return (
    <div id="add-book-container">
      <form action="" id="add-book-form"> 
        <div id="title-container">
          <input type="title" placeholder="Book Title" size="50"
          value={book.title} 
          onChange={handleInput} 
          name="title" id="title" />
        </div>
        <div id="description-container">
          <textarea type="text" placeholder="Book Description" 
          rows="10" cols="80"
          value={book.description} 
          onChange={handleInput} 
          name="description" id="description" />
        </div>
        <div id="cover-image-container">
          <input type="coverImage" placeholder='Cover Image URL' size="50"
          value={book.coverImage} 
          onChange={handleInput} 
          name="coverImage" id="cover-image" />
        </div>
      </form>
      <div id="add-book-result-msg-container">
        <p id="add-book-result-msg" 
          style={{
            backgroundColor: addBookResponse.success === true ? 
            'green' : 'red',
            padding: addBookResponse.msg === '' ? '0' : '8px 16px 8px 16px'
          }}
        >
        { addBookResponse.msg }
        </p>
        
      </div>
      <div>
      <button id="cancel-book-button" type="submit" 
      onClick={handleCancel}>Cancel</button>
        <button id="add-book-button" type="submit" 
        onClick={handleSubmit}>Add Book</button>
      </div>

      
    </div>
  )
}