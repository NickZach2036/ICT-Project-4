import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import BookList from './BookList';
import BookForm from './BookForm';
import BookDetail from './BookDetail';
import './App.css';

function App() {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <Router>
                <header className="App-header">
                    <h1>Bookstore</h1>
                    {keycloak.authenticated ? (
                        <>
                            <button onClick={() => keycloak.logout()}>Logout</button>
                            <Switch>
                                <Route path="/" exact component={BookList} />
                                <Route path="/add" component={BookForm} />
                                <Route path="/books/:id" component={BookDetail} />
                            </Switch>
                        </>
                    ) : (
                        <button onClick={() => keycloak.login()}>Login</button>
                    )}
                </header>
            </Router>
        </div>
    );
}

export default App;
