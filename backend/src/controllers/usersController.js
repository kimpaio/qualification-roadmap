const User = require('../models/User');
const { logger } = require('../utils/logger');

// すべてのユーザーを取得（管理者用）
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    logger.error('ユーザー一覧取得エラー:', error);
    res.status(500).json({ 
      success: false,
      message: 'ユーザー情報の取得中にエラーが発生しました', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// 新規ユーザーを作成（管理者用）
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    logger.error('ユーザー作成エラー:', error);
    res.status(400).json({ 
      success: false,
      message: 'ユーザーの作成中にエラーが発生しました', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// ユーザーIDでユーザーを取得
exports.getUserById = async (req, res) => {
  try {
    // URLパラメータからIDを取得するか、現在のユーザーのIDを使用
    const userId = req.params.id || req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'ユーザーが見つかりませんでした' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('ユーザー情報取得エラー:', error);
    res.status(500).json({ 
      success: false,
      message: 'ユーザー情報の取得中にエラーが発生しました', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// ユーザー情報を更新
exports.updateUser = async (req, res) => {
  try {
    // URLパラメータからIDを取得するか、現在のユーザーのIDを使用
    const userId = req.params.id || req.user.id;
    
    // パスワード変更は認証コントローラーで処理するため、ここでは除外
    if (req.body.password) {
      return res.status(400).json({
        success: false,
        message: 'このルートではパスワードを更新できません。パスワード更新専用のエンドポイントを使用してください。'
      });
    }
    
    // 管理者でない場合、ロールの変更を許可しない
    if (req.body.role && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ユーザーロールを変更する権限がありません'
      });
    }
    
    const user = await User.findByIdAndUpdate(userId, req.body, { 
      new: true,
      runValidators: true
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'ユーザーが見つかりませんでした' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('ユーザー更新エラー:', error);
    res.status(400).json({ 
      success: false,
      message: 'ユーザー情報の更新中にエラーが発生しました', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// ユーザーを削除（管理者用）
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'ユーザーが見つかりませんでした' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'ユーザーが正常に削除されました' 
    });
  } catch (error) {
    logger.error('ユーザー削除エラー:', error);
    res.status(500).json({ 
      success: false,
      message: 'ユーザーの削除中にエラーが発生しました', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// 自分のアカウントを削除（ユーザー自身用）
exports.deleteMyAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      active: false
    });
    
    res.status(200).json({
      success: true,
      message: 'アカウントが正常に削除されました'
    });
  } catch (error) {
    logger.error('アカウント削除エラー:', error);
    res.status(500).json({
      success: false,
      message: 'アカウントの削除中にエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
