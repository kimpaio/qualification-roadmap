const Exam = require('../models/Exam');

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: '試験情報の取得中にエラーが発生しました', error: error.message });
  }
};

exports.createExam = async (req, res) => {
  try {
    const newExam = new Exam(req.body);
    const savedExam = await newExam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    res.status(400).json({ message: '試験情報の作成中にエラーが発生しました', error: error.message });
  }
};

// 指定されたIDの試験情報を取得します
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: '試験情報が見つかりませんでした' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: '試験情報の取得中にエラーが発生しました', error: error.message });
  }
};

// 指定されたIDの試験情報を更新します
exports.updateExam = async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExam) {
      return res.status(404).json({ message: '試験情報が見つかりませんでした' });
    }
    res.json(updatedExam);
  } catch (error) {
    res.status(400).json({ message: '試験情報の更新中にエラーが発生しました', error: error.message });
  }
};

// 指定されたIDの試験情報を削除します
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: '試験情報が見つかりませんでした' });
    }
    res.status(200).json({ message: '試験情報が正常に削除されました' });
  } catch (error) {
    res.status(500).json({ message: '試験情報の削除中にエラーが発生しました', error: error.message });
  }
};

// 日付で試験を検索します
exports.getExamsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    if (startDate && endDate) {
      query.examDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.examDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.examDate = { $lte: new Date(endDate) };
    }
    
    const exams = await Exam.find(query);
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: '日付による試験情報の検索中にエラーが発生しました', error: error.message });
  }
};
