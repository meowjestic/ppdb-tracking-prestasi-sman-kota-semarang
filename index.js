import express from 'express';
import bodyParser from 'body-parser';
import siswaRouters from './routers/siswa.js'
import cors from 'cors'

const app = express()
const __PORT__= 5000


app.use(bodyParser.json())
app.use(cors())
app.use('/peringkat', siswaRouters)
app.get('/', (req,res) => res.send('WELCOME !'))





app.listen(__PORT__, () => console.log(`Server is running on ${__PORT__}`))



