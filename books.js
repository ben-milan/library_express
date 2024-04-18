const express = require('express')
const books = require('./books.json')

const router = express.Router()

router.use(express.json())

router.get('/books', (req, res) => {
  res.json(books)
})

router.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const book = books.find(book => book.isbn === isbn)

  if (book !== undefined) {
    res.json(book)
  } else {
    res.status(404).send('Dieses Buch ist nicht vorhanden.')
  }
})

router.post('/books', (req, res) => {
  const newBook = req.body
  if (newBook.json) {
    books.push(newBook)
    res.status(201).json(newBook)
  } else {
    res.sendStatus(422)
  }
})

router.put('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const book = req.body
  if (book.isbn && book.title && book.year && book.author) {
    let found = false

    for (let i = 0; i < books.length; i++) {
      if (String(books[i].isbn) === String(JSON.parse(isbn))) {
        books[i] = book
        res.status(200).json(books[i])
        found = true
      }
    }

    if (found === false) {
      res.sendStatus(404)
    }
  } else {
    res.sendStatus(422)
  }
})

router.delete('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const bookIdx = books.findIndex(book => String(book.isbn) === String(isbn))

  if (bookIdx !== -1) {
    books.splice(bookIdx, 1)
    res.status(200).json(books)
  } else {
    res.sendStatus(404)
  }
})

router.patch('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const bookIdx = books.findIndex(book => String(book.isbn) === String(isbn))
  const book = req.body

  if (bookIdx !== -1) {
    Object.assign(books[bookIdx], book)
    res.status(200).json(books[bookIdx])
  } else {
    res.sendStatus(404)
  }
}

)

module.exports = router
