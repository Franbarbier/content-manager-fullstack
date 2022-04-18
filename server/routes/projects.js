import express from 'express';

import { getProjects, createProject, deleteProject, editProject } from '../controllers/projects.js';


const router = express.Router()

router.get('/', getProjects );
router.post('/', createProject );
router.delete('/:id', deleteProject)
router.patch('/', editProject)

export default router;