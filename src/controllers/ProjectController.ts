import type { Request, Response } from 'express'
import Project from '../models/Project'

export class ProjectController {
    
    static createProjects = async (req: Request, res: Response) => {

        const project = new Project(req.body)

        try {
            await project.save()
            res.send('Proyecto Creado Correctamente')
        } catch (error){
            console.log(error)
        }

    }
    
    static getAllProjects = async (req: Request, res: Response) => {
        
        try {
            const project = await Project.find({})
            res.json(project)
        } catch(error) {
            console.log(error)
        }
    }
}