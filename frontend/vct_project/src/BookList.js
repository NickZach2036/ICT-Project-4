import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

const BookList = () => {
    const { keycloak } = useKeycloak();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/books', {
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        })
        .then(response => {
            setBooks(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the books!', error);
        });
    }, [keycloak.token]);

    return (
        <div>
            <h1>Book List</h1>
            <ul>
                {books.map(book => (
                    <li key={book.id}>{book.title} by {book.author}</li>
                ))}
            </ul>
        </div>
    );
}

export default BookList;
