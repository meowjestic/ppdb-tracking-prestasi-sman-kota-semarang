import express from 'express'
import { getAllPeringkat } from '../controllers/siswa.js';

const routers = express.Router()

routers.get('/:id', getAllPeringkat)

export default routers;