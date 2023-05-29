const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

/* home - cadastro de livros
   o botão do insert chama a rota /books/insertbook
*/
app.get('/', (req, res) => {
    res.render('home')
})

// rota que cadastra livros
app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pageqtd = req.body.pageqtd

    //const sql = `INSERT INTO books (title, pageqtd) VALUES ('${title}', '${pageqtd}')`
    /* preparando query, colocando '?' colunas 2 ?? dados 1 ?
       precisamos de um array que informa o que será substitudo pelo que > data
       é um step a mais que o sql valida os dados
       passamos no query() mais um argumento > data
    */
    const sql = `INSERT INTO books (??, ??) VALUES (?, ?)`
    const data = ['title', 'pageqtd', title, pageqtd]

    pool.query(sql, data, function(err){
        if(err) {
            console.log(err)
            return
        }

        res.redirect('/books')

    })
})

// rota para listar todos os livros
app.get('/books', (req, res) => {
    const sql = "SELECT * FROM books"

    pool.query(sql, function(err, data) {
        if(err) {
            console.log(err)
            return
        }

        const books = data

        console.log(books)

        res.render('books', { books })
    })
})

// rota para filtrar livros
app.get('/books/:id', (req, res) => {

    const id = req.params.id

    //const sql = `SELECT * FROM books WHERE id = ${id}`
    const sql = `SELECT * FROM books WHERE ?? = ?`

    const data = ['id', id]

    pool.query(sql, data, function(err, data) {
        if(err){
            console.log(err)
            return
        }

        const book = data[0]

        res.render('book', { book })

    })
})

// rota para carregar dados - 1 passo da edição de livros
app.get('/books/edit/:id', (req, res) => {

    const id = req.params.id

    //const sql = `SELECT * FROM books WHERE id = ${id}`
    const sql = `SELECT * FROM books WHERE ?? = ?`

    const data = ['id', id]


    pool.query(sql, data, function(err, data) {
        if(err){
            console.log(err)
            return
        }

        const book = data[0]

        res.render('editbook', { book })
    })

})

// rota para fazer update dos dados que o usuario alterou e direcionar para a lista de livros
app.post('/books/updatebook', (req, res) => {
    
    const id = req.body.id
    const title = req.body.title
    const pageqtd = req.body.pageqtd

    //const sql = `UPDATE books SET title = '${title}', pageqtd = '${pageqtd}' WHERE id = ${id}`
    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title', title, 'pageqtd', pageqtd, 'id', id]

    pool.query(sql, data, function(err){
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

// delete
app.post('/books/remove/:id', (req, res) => {

    const id = req.params.id

    const sql = `DELETE FROM books WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, function(err) {
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.listen(3000)

