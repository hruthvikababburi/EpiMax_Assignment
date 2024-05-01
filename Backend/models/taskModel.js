const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title:{type:String,require:true},
    description:{type:String,require:true},
    assignedTo:{type:mongoose.Schema.Types.ObjectId,ref:'User',require:true},
    status:{type:String,enum:['pending','doing','completed'],default:'pending'},
    createdBy:{type: mongoose.Schema.Types.ObjectId,ref: 'User',require: true}
})

module.exports = mongoose.model('Task',taskSchema)