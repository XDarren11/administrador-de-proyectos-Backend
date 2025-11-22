import { Router } from 'express';
import { ProjectController } from "../controllers/ProjectController";

const router = Router()

router.get('/', ProjectController.getAllProjects)

console.log(router)
export default router