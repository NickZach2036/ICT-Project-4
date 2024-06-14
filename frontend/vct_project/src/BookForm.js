import React, { useState } from 'react';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

const BookForm = () => {
    const { keycloak } = useKeycloak();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/books', { title, author, description, price }, {
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        })
        .then(response => {
            console.log(response);
            setTitle('');
            setAuthor('');
            setDescription('');
            setPrice('');
        })
        .catch(error => {
            console.error('There was an error adding the book!', error);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Author:</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div>
                <label>Price:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <button type="submit">Add Book</button>
        </form>
    );
};

export default BookForm;
