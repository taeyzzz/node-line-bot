const express = require('express')
const morgan = require('morgan')

const lineRouter = require('./router/line')

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(morgan("dev"))

app.get('/', (req, res) => res.send('Hello World!'))

app.use('/line', lineRouter)

app.listen(PORT, () => {
    console.log(`Server ready: ${PORT}`)
})
