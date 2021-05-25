import mongoose, { Schema, Types } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
const taskSchema = new Schema({
  task: {
    type: String,
    index: true,
    trim: true,
    required: true
  },
  done: {
    type: Boolean,
    default: false,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true
})



taskSchema.plugin(mongooseKeywords, { paths: ['task', 'done'] })

const model = mongoose.model('Task', taskSchema)

export const schema = model.schema
export default model
