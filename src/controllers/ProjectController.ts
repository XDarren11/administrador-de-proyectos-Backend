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

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')

            if(!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }

            res.json(project)
        } catch(error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)

            if(!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }

            project.clientName = req.body.clientName
            project.description = req.body.description
            project.projectName = req.body.projectName
            
            await project.save()
            res.send('Proyecto Actualizado')

        } catch(error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)

            if(!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }

            await project.deleteOne()
            res.send('Proyecto Eliminado Correctamente')

        } catch(error) {
            console.log(error)
        }
    }
}