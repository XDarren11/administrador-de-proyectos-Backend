import mongoose, {Schema, Document} from "mongoose";

export type ProjectType = Document & {
    projectName: string
    clientName: string
    description: string
}

const ProjectSchema: Schema = new Schema({
    
    projectName: {
        type: String,
        required: true, //hace que sea necesario el dato
        trim: true  //Quita los espacios de mas
    },
    clientName: {
        type: String,
        required: true, //hace que sea necesario el dato
        trim: true  //Quita los espacios de mas
    },
    description: {
        type: String,
        required: true, //hace que sea necesario el dato
        trim: true  //Quita los espacios de mas
    },

})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project