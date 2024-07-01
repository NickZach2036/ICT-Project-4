import { React, useState } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './Home';
// import BookList from './BookList';
// import BookForm from './BookForm';
// import BookDetail from './BookDetail';
import axios from 'axios';
import './App.css';

import Keycloak from "keycloak-js";

// const backendAddress = "localhost:5002";

let initOptions = {
  url: 'http://localhost:8080/',
  realm: 'books_service',
  clientId: 'frontend',
}

const kc = new Keycloak(initOptions);

kc.init({
  onLoad: 'login-required', // Supported values: 'check-sso' (default), 'login-required'
  checkLoginIframe: true
}).then((auth) => {
  if (!auth) {
    // window.location.reload();
  }
  else {
    console.log(kc.token)
  }
});

// kc.logout();

function App() {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        let response = await fetch("http://localhost:5000/books", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author, description, token: kc.token })
        });
        let data = await response.json();
        // console.log(data);
        refreshBooks();
    };

    const refreshBooks = () => {
        axios.get('http://localhost:5000/books')
        .then(response => {
            setBooks(response.data.books);
            // console.log(response.data.books);
        })
        .catch(error => {
            console.error('There was an error fetching the books!', error);
        });
    };

    refreshBooks();

    return (
        <div className="App">
            <header className="App-header">
                <h1>Bookstore</h1>
                {kc.authenticated ? (
                    <button onClick={() => {kc.login()}}>Login</button>
                ) : (
                    <button onClick={() => {kc.logout()}}>Logout</button>
                )}
            </header>

            <div>
                <h1>Book List</h1>
                <ul>
                    {books.map(book => (
                        <li key={book.id}>{book.title} by {book.author} ({book.description})</li>
                    ))}
                </ul>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <br></br>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Author:</label>
                    <br></br>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <div>
                    <label>Description:</label>
                    <br></br>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <button type="submit">Add Book</button>
            </form>
        </div>
    );
}

export default App;
