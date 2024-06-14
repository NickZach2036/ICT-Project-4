from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Book
from config import Config
from flask_keycloak import FlaskKeycloak, requires_auth

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

keycloak = FlaskKeycloak(app)
keycloak.init_app(app, client_id='bookstore-backend', server_url='http://localhost:8080/auth', realm_name='bookstore')

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/books', methods=['GET'])
@requires_auth
def get_books():
    books = Book.query.all()
    return jsonify([{'id': book.id, 'title': book.title, 'author': book.author, 'description': book.description, 'price': book.price} for book in books])

@app.route('/books', methods=['POST'])
@requires_auth
def add_book():
    data = request.get_json()
    new_book = Book(title=data['title'], author=data['author'], description=data.get('description', ''), price=data.get('price', 0))
    db.session.add(new_book)
    db.session.commit()
    return jsonify({'id': new_book.id}), 201

@app.route('/books/<int:id>', methods=['GET'])
@requires_auth
def get_book(id):
    book = Book.query.get(id)
    if book:
        return jsonify({'id': book.id, 'title': book.title, 'author': book.author, 'description': book.description, 'price': book.price})
    return jsonify({'error': 'Book not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
