import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { DeleteModal } from './DeleteModal';
import './UserBooks.css'


export const UserBooks = () => {
  
  const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
    withCredentials: true // To send the saved cookies with every client request to the server
  })

  // State for storing books (book id, title, description, coverImage)
  const [books, setBooks] = useState(null);
  const navigate = useNavigate();

  
  // Fetches user books and sets them in the "books" state
  useEffect( () => {

    async function fetchData() {
      const response = await api.get(`/books/user/${Cookies.get('id')}`, 
      Cookies.get('id'));

      try {
        console.log(response.status)
        if (response.status === 200){
          console.log(response.data.book)
          const renderedBooks = response.data.book;
          setBooks(renderedBooks)
        }
      } catch (error) {
        console.log('Failed to fetch your books');
      }
    }

    fetchData();
      
  }, [])



  // Handles book edit button
  const handleUpdate = async(index) => {
    // Pass the selected book id to the URL 
    const queryString = new URLSearchParams({
      id: books[index].id,
    })
    navigate(`/profile/books/edit/query?${queryString}`)
  }


  // Handles book delete button
  const openDeleteModal = (book) => {
    setShowModalData( {id: book.id, title: book.title} );
    setShowModal(true)
  }

  const closeDeleteModal = () => {
    setShowModal(false)
  }

  const [showModal, setShowModal] = useState(false);
  const [showModalData, setShowModalData] = useState({
    id: '',
    title: '',
  });
  

  return (
      <div id="show-user-books-container">
        {books?.map((book, index) => 
          <div id="show-user-books">
            <div id="user-books-info">
              <h1>{book.title}</h1>
              <div id="user-books-info-container">
                <img src={book.coverImage} alt="Book cover"
                style={{width: "200px", height: "300px"}} />
                <p>{book.description}</p>
              </div>
            </div>
            <div id="user-books-button">
              <button  type="submit" id="edit-book"
              onClick={ async() => { handleUpdate(index) }}>Edit</button>
              <button type="submit" id="delete-book" key={book.toString()}
              onClick={() => {
                openDeleteModal(book);
              }} >Delete</button>

            </div>
            <br/>
          </div>
        )}
        <DeleteModal
          show={showModal}
          onHide={closeDeleteModal}
          bookinfo={showModalData}  
        />
      </div>
  )
}