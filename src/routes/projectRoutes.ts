import { Router } from 'express';
import { body } from 'express-validator'
import { ProjectController } from "../controllers/ProjectController";
import { handleInputError } from '../middleware/validation';

const router = Router()

router.post('/', 
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripcion del Proyecto es Obligatoria'),    
    handleInputError,
    ProjectController.createProjects
)


router.get('/', ProjectController.getAllProjects)

export default router