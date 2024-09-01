const express = require('express')
const morgan = require('morgan')

const app = express()

const PORT = process.env.PORT ?? 3000

app.use(morgan("dev"))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/', (req, res) => {
    console.log(req.body)
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Server ready: ${PORT}`)
})
