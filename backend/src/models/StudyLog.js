const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudyLogSchema = new Schema({
  date: {
    type: Date,
    required: [true, '日付は必須です'],
    default: Date.now
  },
  duration: {
    type: Number,
    required: [true, '学習時間は必須です'],
    min: [1, '学習時間は1分以上である必要があります']
  },
  topic: {
    type: String,
    required: [true, 'トピックは必須です']
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ユーザーIDは必須です']
  },
  notes: {
    type: String,
    default: ''
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

module.exports = mongoose.model('StudyLog', StudyLogSchema);
