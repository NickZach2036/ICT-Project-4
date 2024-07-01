from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from models import *
import requests
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
# from flask_keycloak import FlaskKeycloak, requires_auth

db_host = "localhost" # "db-loadbalancer"

keycloak_host = "localhost" # "keycloak"
realm_id = "books_service"
client_id = "backend"
client_secret = "YtPogm28V7Ef7uTaBBQG1Y3o3QW8J77C"

app = Flask(__name__)
CORS(app)

def create_db_engine():
    return create_engine(f"mariadb+pymysql://lyubo:password@{db_host}:3306/bookstore-db")

@app.route('/books', methods=['GET'])
def get_books():
    engine = create_db_engine()

    with Session(engine) as session:
        books = session.scalars(select(Book))

        books = [
        {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'description': book.description
        } for book in books]

        return make_response({"message": "Books were loaded successfully", "books": books})

@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    response = requests.post(f"http://{keycloak_host}:8080/realms/{realm_id}/protocol/openid-connect/token/introspect", {"client_id": client_id, "client_secret": client_secret, "token": data["token"]}).json()
    if response["active"] == False:
        return make_response({"message": "Unauthorized"}, 401)

    engine = create_db_engine()

    with Session(engine) as session:
        new_book = Book(
            title=data['title'],
            author=data['author'],
            description=data['description'],
            user_id=response["sub"]
        )
        session.add(new_book)
        session.commit()

        return jsonify({'id': new_book.id}), 201

# @app.route('/books/<int:id>', methods=['GET'])
# def get_book(id):
#     book = Book.query.get(id)
#     if book:
#         return jsonify({'id': book.id, 'title': book.title, 'author': book.author, 'description': book.description, 'price': book.price})
#     return jsonify({'error': 'Book not found'}), 404

Base.metadata.create_all(create_db_engine())

if __name__ == '__main__':
    app.run(debug=True)