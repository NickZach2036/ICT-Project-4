import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const BookDetail = () => {
    const { id } = useParams();
    const { keycloak } = useKeycloak();
    const [book, setBook] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/books/${id}`, {
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        })
        .then(response => setBook(response.data))
        .catch(error => console.error('Error fetching book:', error));
    }, [id, keycloak.token]);

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{book.title}</h1>
            <p>Author: {book.author}</p>
            <p>{book.description}</p>
            <p>Price: ${book.price}</p>
        </div>
    );
};

export default BookDetail;
