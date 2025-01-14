const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getUserById = (req, res) => {
  // IDに基づいてユーザーを取得する処理
};

exports.updateUser = (req, res) => {
  // ユーザーの情報を更新する処理
};

exports.deleteUser = (req, res) => {
  // ユーザーを削除する処理
};
