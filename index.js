const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('homepage')
})


app.get('/episode', (req, res) =>{
    res.render('episode')
})

app.get('/user/:username', (req, res) => {
    let data =  { username: req.params.username, hobbies: [ 'EbatJope', 'FortePiano' ] }
    res.render('character', data)
})

app.get('/cast', (req, res) =>{
    res.render('cast')
})

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`)
})
//Проверка