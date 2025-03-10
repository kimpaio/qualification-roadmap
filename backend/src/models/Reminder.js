const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReminderSchema = new Schema({
  title: {
    type: String,
    required: [true, 'タイトルは必須です']
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: [true, '日付は必須です']
  },
  exam: {
    type: Schema.Types.ObjectId, 
    ref: 'Exam'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ユーザーIDは必須です']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', ReminderSchema);
