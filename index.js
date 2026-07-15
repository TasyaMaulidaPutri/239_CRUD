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

// ==================== READ (all) ====================
app.get('/', (req, res) => {
    console.log("TEST DATA");
    pool.query('SELECT * FROM biodata ORDER BY id ASC')
        .then(testData => {
            console.log(testData.rows);
            res.json(testData.rows);
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            res.status(500).send("Database Error");
        });
});

// ==================== READ (by id) ====================
app.get('/biodata/:id', (req, res) => {
    const { id } = req.params;

    pool.query('SELECT * FROM biodata WHERE id = $1', [id])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Data tidak ditemukan' });
            }
            res.json(result.rows[0]);
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            res.status(500).send("Database Error");
        });
});

// ==================== CREATE ====================
app.post('/biodata', (req, res) => {
    const { nama, nim, kelas } = req.body;

    if (!nama || !nim) {
        return res.status(400).json({ message: 'nama dan nim wajib diisi' });
    }

    pool.query(
        'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *',
        [nama, nim, kelas]
    )
        .then(result => {
            res.status(201).json(result.rows[0]);
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            res.status(500).send("Database Error");
        });
});

// ==================== UPDATE ====================
app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;

    pool.query(
        'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
        [nama, nim, kelas, id]
    )
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Data tidak ditemukan' });
            }
            res.json(result.rows[0]);
        })
        .catch(err => {
            console.error('Error executing query', err.stack);
            res.status(500).send("Database Error");
        });
});



app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})