import express from 'express'
import pg from 'pg'
const app = express()
const port = 3000
const {Pool} = pg

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true
    })
)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'tasya123',
    port: 5432
})



app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})