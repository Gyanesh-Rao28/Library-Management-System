# Library Management System API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Endpoints](#endpoints)
   - [Test](#test)
   - [Users](#users)
   - [Books](#books)
   - [Transactions](#transactions)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Example Requests](#example-requests)

## Introduction

This document provides documentation for the Library Management System API. The API allows users to register, login, manage books, and handle book transactions.

## Base URL

The base URL for all API endpoints is: `/api/v1`

## Authentication

Authentication is required for most endpoints. Use the login endpoint to obtain an authentication token.

## Endpoints

### Test

#### Test API
- **URL:** `/test`
- **Method:** GET
- **Description:** Test if the API is working.

### Users

#### Register User
- **URL:** `/users/registerUser`
- **Method:** POST
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Description:** Register a new user.

#### Login User
- **URL:** `/users/loginUser`
- **Method:** POST
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Description:** Authenticate a user and receive a token.

### Books

#### Get All Books
- **URL:** `/`
- **Method:** GET
- **Description:** Retrieve a list of all books.

#### Insert Book
- **URL:** `/insertBook`
- **Method:** POST
- **Body:**
  ```json
  {
    "boofRefId": "NCERT-PHYEDU-9",
    "name": "NCERT Physical Education Class 9",
    "author": "NCERT",
    "category": "Physical Education",
    "rentPerDay": 15
  }
  ```
- **Description:** Add a new book to the library.

#### Get Book by ID
- **URL:** `/books/:id`
- **Method:** GET
- **Description:** Retrieve a specific book by its ID.
- **Example:** `/books/HC-VERMA-1`

#### Search Books
- **URL:** `/books/search`
- **Method:** GET
- **Query Parameters:** 
  - `term`: Search term for book name
- **Description:** Search for books by name.
- **Example:** `/books/search?term=NCERT`

#### Search Books by Rent Range
- **URL:** `/books/rentRange`
- **Method:** GET
- **Query Parameters:**
  - `min`: Minimum rent
  - `max`: Maximum rent
- **Description:** Search for books within a specific rent range.
- **Example:** `/books/rentRange?min=10&max=20`

#### Advanced Book Search
- **URL:** `/books/filter`
- **Method:** GET
- **Query Parameters:**
  - `category`: Book category
  - `term`: Search term
  - `minRent`: Minimum rent
  - `maxRent`: Maximum rent
- **Description:** Advanced search for books with multiple filters.
- **Example:** `/books/filter?category=Science&term=Physics&minRent=0&maxRent=40`

### Transactions

#### Issue Book
- **URL:** `/transactions/issue`
- **Method:** POST
- **Body:**
  ```json
  {
    "bookId": "66e2ad6c1a92d0ae33512fc2",
    "userId": "66e2bcb2248e93fae21296a9"
  }
  ```
- **Description:** Issue a book to a user.

#### Return Book
- **URL:** `/transactions/return`
- **Method:** POST
- **Body:**
  ```json
  {
    "bookId": "66e2ad6c1a92d0ae33512fc2",
    "userId": "66e2bcb2248e93fae21296a9"
  }
  ```
- **Description:** Return a book from a user.

#### Get Book History
- **URL:** `/transactions/bookHistory`
- **Method:** GET
- **Query Parameters:**
  - `bookName`: Name of the book
- **Description:** Retrieve the transaction history for a specific book.
- **Example:** `/transactions/bookHistory?bookName=NCERT Mathematics Class 10`

#### Get Total Rent for Book
- **URL:** `/transactions/bookRent`
- **Method:** GET
- **Query Parameters:**
  - `bookName`: Name of the book
- **Description:** Get the total rent collected for a specific book.
- **Example:** `/transactions/bookRent?bookName=NCERT Mathematics Class 10`

#### Get Books Issued to User
- **URL:** `/transactions/bookIssued`
- **Method:** GET
- **Query Parameters:**
  - `userId`: ID of the user
- **Description:** Retrieve all books currently issued to a specific user.
- **Example:** `/transactions/bookIssued?userId=66e2bcb2248e93fae21296a9`

#### Get Books Issued in Date Range
- **URL:** `/transactions/bookDateRange`
- **Method:** GET
- **Query Parameters:**
  - `startDate`: Start date (YYYY-MM-DD)
  - `endDate`: End date (YYYY-MM-DD)
- **Description:** Retrieve all book transactions within a specific date range.
- **Example:** `/transactions/bookDateRange?startDate=2024-09-12&endDate=2024-09-13`

## Data Models

### User
- email (string)
- password (string)

### Book
- boofRefId (string)
- name (string)
- author (string)
- category (string)
- rentPerDay (number)

## Error Handling

The API uses standard HTTP response codes to indicate the success or failure of requests. Detailed error messages are provided in the response body for debugging purposes.

## Example Requests

Here are some example requests demonstrating how to use routes with parameters and queries:

1. Get a specific book by ID:
   ```
   GET /api/v1/books/HC-VERMA-1
   ```

2. Search for books with a specific term:
   ```
   GET /api/v1/books/search?term=NCERT
   ```

3. Search for books within a rent range:
   ```
   GET /api/v1/books/rentRange?min=10&max=20
   ```

4. Advanced book search:
   ```
   GET /api/v1/books/filter?category=Science&term=Physics&minRent=0&maxRent=40
   ```

5. Get book history:
   ```
   GET /api/v1/transactions/bookHistory?bookName=NCERT Mathematics Class 10
   ```

6. Get books issued to a specific user:
   ```
   GET /api/v1/transactions/bookIssued?userId=66e2bcb2248e93fae21296a9
   ```

7. Get books issued within a date range:
   ```
   GET /api/v1/transactions/bookDateRange?startDate=2024-09-12&endDate=2024-09-13
   ```

---

For any additional information or support, please contact the API development team.