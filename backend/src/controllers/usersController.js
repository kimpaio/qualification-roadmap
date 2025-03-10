const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'ユーザー情報の取得中にエラーが発生しました', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: 'ユーザーの作成中にエラーが発生しました', error: error.message });
  }
};

// 指定されたIDのユーザーをデータベースから検索し、見つかった場合はそのユーザーの情報を返します。
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'ユーザー情報の取得中にエラーが発生しました', error: error.message });
  }
};

// 指定されたIDのユーザーの情報を更新します。更新内容はリクエストボディから取得します。
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'ユーザー情報の更新中にエラーが発生しました', error: error.message });
  }
};

// 指定されたIDのユーザーをデータベースから削除します。
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
    }
    res.status(200).json({ message: 'ユーザーが正常に削除されました' });
  } catch (error) {
    res.status(500).json({ message: 'ユーザーの削除中にエラーが発生しました', error: error.message });
  }
};
