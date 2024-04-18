const express = require("express")
const exSession = require("express-session")
const app = express()
const port = 3000

const books = require("./books.json")
const lends = require("./lends.json")
const path = require("path")

app.use(express.json())
app.use(exSession({
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

app.get("/books", (req, res) => {
    res.json(books)
})

app.get("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const book = books.find(book => book.isbn === isbn)
    
    if (book !== undefined) {
        res.json(book)
    } else {
        res.status(404).send("Dieses Buch ist nicht vorhanden.")
    }
    
})

app.post("/books", (req, res) => {
    const newBook = req.body
    if (newBook.json) {
        books.push(newBook)
        res.status(201).json(newBook)
    } else {
        res.sendStatus(422)
    }
    
})

app.put("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const book = req.body
    if(book.isbn && book.title && book.year && book.author) {
        let found = false;

        for (let i=0; i<books.length; i++) {
            if (String(books[i].isbn) === String(JSON.parse(isbn))) {
                books[i] = book;
                res.status(200).json(books[i])
                found = true;
            } 
        } 
        
        if (found === false) {
            res.sendStatus(404)
        }

    } else {
        res.sendStatus(422)
    }
    
})

app.delete("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const bookIdx = books.findIndex(book => String(book.isbn) === String(isbn))

    if (bookIdx !== -1) {
        books.splice(bookIdx, 1)
        res.status(200).json(books)
    } else {
        res.sendStatus(404)
    }
    
})

app.patch("/books/:isbn", (req, res) => {
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

app.get("/lends", (req, res) => {
    res.sendFile(path.join(__dirname, "/lends.json"))
})

app.get("/lends/:id", (req, res) => {
    const id = req.params.id
    const lend = lends.find(lend => String(lend.id) === String(id))
    
    if (lend !== undefined) {
        res.status(200).json(lend)
    } else {
        res.sendStatus(404)
    }
    
})

app.post("/lends", (req, res) => {
    const lend = req.body

    if (lend.id && lend.customer_id && lend.isbn && lend.borrowed_at) {
        lends.push(lend)
        res.status(201).json(lend)
    } else {
        res.sendStatus(422)
    }
})

app.delete("/lends/:id", (req, res) => {
    const id = req.params.id
    const lendIdx = lends.findIndex(lend => String(lend.id) === String(id))

    if (lendIdx !== -1) {
        lends.splice(lendIdx, 1)
        res.sendStatus(200)
    } else {
        res.sendStatus(404)
    }
})

app.post("/login", (req, res) => {
    const testCredentials = {email: "me@me.com", password: "me"}
    const email = req.query.email
    const pwd = req.query.password

    if (String(email.toLowerCase()) === String(testCredentials.email) && pwd === testCredentials.password) {
        req.session.auth = "authentifiziert"
        req.session.logIn = [{"email": email, "pwd": pwd}]
        res.status(200).send(req.session.auth)
    } else {
        res.sendStatus(403)
    }

    
})

app.get("/verify", (req, res) => {
    if (String(req.session.auth) === "authentifiziert") {
        res.status(200).send(req.session.logIn[0].email)
        
    } else {
        res.sendStatus(401)
    }
})

app.delete("/logout", (req, res) => {
    if (req.session.logIn && req.session.logIn[0] && req.session.logIn[0].hasOwnProperty('email') && req.session.logIn[0].hasOwnProperty('pwd')) {
        req.session.auth = "nicht authentifiziert"
        req.session.logIn[0].email = null
        req.session.logIn[0].pwd = null
        res.sendStatus(204)
    } else {
        res.sendStatus(401)
    }
})


app.listen(port, () => {
    console.log("Listening to port:", port)
})