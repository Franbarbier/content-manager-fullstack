import express from 'express';

import { getProjects, createProject, deleteProject } from '../controllers/projects.js';


const router = express.Router()

router.get('/', getProjects );
router.post('/', createProject );
router.delete('/:id', deleteProject)

export default router;