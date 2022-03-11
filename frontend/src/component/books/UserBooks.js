import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { EditBook } from './EditBook';
import './UserBooks.css'

export const UserBooks = () => {
  
  

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
    withCredentials: true // To send the saved cookies with every client request to the server
  })

  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const bookDataResponse = useEffect( async () => {

      await api.get(`/books/user/${Cookies.get('id')}`, 
      Cookies.get('id'))
      .then(response => {
        console.log(response.status)
        if (response.status == 200){
          console.log('hi')
          console.log(response.data.book)
          const renderedBooks = response.data.book;
          console.log(renderedBooks);
          setData(renderedBooks)
        }
      })
      .catch(error => {
        // console.log(error.response.data.msg);
      // setAddBookResponse({ ...addBookResponse, msg : error.response.data.msg });
      // alert("You're logged out. Please log in again.");
      })
  }, [])

  const [clickedIndex, setClickedIndex] = useState({});

  const handleDelete = async(index) => {
    console.log("clicked = " + data[index].id);
    const bookID = data[index].id;
    const response = await(api.delete(`books/${bookID}`))
    .then(response => {
      console.log(response.status);
      if (response.status == 200) {
        alert(`Successfully deleted the book with id = ${bookID}.`)
      }
      window.location.reload();
      // bookDataResponse;
    })
    .catch(error => {
      alert(`Failed to delete book. ` + error);
    })
  }

  const handleUpdate = async(index) => {
    // Pass the selected book info to the URL 
    const queryString = new URLSearchParams({
      id: data[index].id,
    })
    navigate(`/profile/books/edit/query?${queryString}`)
  }

  return (
      <div id="show-user-books-container">
        {data?.map((book, index) => 
          <div id="show-user-books">
            <div id="user-books-info">
              <p>id = {book.id}</p>
              <p>title = {book.title}</p>
              <p>description = {book.description}</p>
              <p>coverImage = {book.coverImage}</p>
            </div>
            <div id="user-books-button">
              {/* {console.log(book.id)} */}
              <button  type="submit" id="edit-book"
              onClick={ async() => { handleUpdate(index) }}>Edit</button>
              <button type="submit" id="delete-book"
              onClick={async() => { handleDelete(index) }} >Delete</button>
            </div>
            <br/>
          </div>
        )}
      </div>
    // </div>
  )
}