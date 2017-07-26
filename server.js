const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const database = require('./config/database')
const app = express()

require('ejs')
app.set('view engine', 'ejs');

require('dotenv').config()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser());
app.use(session({secret: process.env.COOKIE_SECRET || 'vinyl', maxAge: null}));

const albums = require('./routes/albums')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

app.use('/albums/', albums)
app.use('/auth/', auth)
app.use('/users/', users)
app.use('/reviews/', reviews)

app.get('/', (request, response) => {
    response.redirect('/albums/')
})

app.use((request, response) => {
    response.status(404).render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}...`)
})