const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MilestoneSchema = new Schema({
  title: {
    type: String,
    required: [true, 'タイトルは必須です']
  },
  targetDate: {
    type: Date,
    required: [true, '目標日は必須です']
  },
  description: {
    type: String,
    default: ''
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
  completed: {
    type: Boolean,
    default: false
  },
  completedDate: {
    type: Date,
    default: null
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

module.exports = mongoose.model('Milestone', MilestoneSchema);
