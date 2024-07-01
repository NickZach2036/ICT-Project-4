# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

# class Book(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(80), nullable=False)
#     author = db.Column(db.String(80), nullable=False)
#     description = db.Column(db.Text, nullable=True)
#     price = db.Column(db.Float, nullable=False)
#     ownerID = db.Column(db.Text, nullable = False)

from sqlalchemy import Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Book(Base):
    __tablename__ = "books"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(Text)
    author: Mapped[str] = mapped_column(Text)
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)

    def __init__(self, author, user_id, title, description):
        self.user_id = user_id
        self.author = author
        self.title = title
        self.description = description