// 参考書情報に関するコントローラーのアクションを定義します。
const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: '参考書情報の取得中にエラーが発生しました', error: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: '参考書の作成中にエラーが発生しました', error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: '参考書が見つかりませんでした' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: '参考書情報の取得中にエラーが発生しました', error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: '参考書が見つかりませんでした' });
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: '参考書情報の更新中にエラーが発生しました', error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: '参考書が見つかりませんでした' });
    }
    res.status(200).json({ message: '参考書が正常に削除されました' });
  } catch (error) {
    res.status(500).json({ message: '参考書の削除中にエラーが発生しました', error: error.message });
  }
};
