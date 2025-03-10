const User = require('../models/User');
const crypto = require('crypto');
const { sendTokenResponse } = require('../utils/authUtil');
const { logger } = require('../utils/logger');

// ユーザー登録
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 同じメールアドレスのユーザーが既に存在するか確認
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'このメールアドレスは既に使用されています'
      });
    }

    // 新規ユーザーの作成
    const user = await User.create({
      name,
      email,
      password
    });

    // トークンを使用してレスポンスを送信
    sendTokenResponse(user, 201, res);
  } catch (error) {
    logger.error('ユーザー登録エラー:', error);
    res.status(500).json({
      success: false,
      message: 'ユーザー登録に失敗しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ユーザーログイン
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // メールアドレスとパスワードの入力チェック
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'メールアドレスとパスワードを入力してください'
      });
    }

    // パスワードフィールドを含めてユーザーを検索
    const user = await User.findOne({ email }).select('+password');

    // ユーザーが存在しない、またはパスワードが一致しない場合
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません'
      });
    }

    // トークンを使用してレスポンスを送信
    sendTokenResponse(user, 200, res);
  } catch (error) {
    logger.error('ログインエラー:', error);
    res.status(500).json({
      success: false,
      message: 'ログインに失敗しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ログアウト
exports.logout = (req, res) => {
  // JWTクッキーを無効化
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'ログアウトしました'
  });
};

// パスワードを忘れた場合のリセットトークン生成
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // ユーザーが存在しない場合でもセキュリティ上の理由から同じメッセージを返す
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'パスワードリセットトークンが送信されました（実際には送信されていません）'
      });
    }

    // パスワードリセットトークンを生成
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 実際のアプリケーションでは、ここでリセットURLをメールで送信する
    // const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;

    logger.info(`パスワードリセットトークン: ${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'パスワードリセットトークンが送信されました',
      // 開発環境のみトークンを返す
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    logger.error('パスワードリセットエラー:', error);

    // エラー時にはリセットトークンをクリア
    if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
      }
    }

    res.status(500).json({
      success: false,
      message: 'パスワードリセットメールの送信に失敗しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// パスワードリセットの実行
exports.resetPassword = async (req, res) => {
  try {
    // トークンをハッシュ化して、データベースに保存されているものと比較
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // トークンが有効かつ期限内のユーザーを検索
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // トークンが無効または期限切れの場合
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'トークンが無効または期限切れです'
      });
    }

    // 新しいパスワードを設定
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 新しいトークンでログイン
    sendTokenResponse(user, 200, res);
  } catch (error) {
    logger.error('パスワードリセットエラー:', error);
    res.status(500).json({
      success: false,
      message: 'パスワードリセットに失敗しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 現在ログイン中のユーザー情報を取得
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    logger.error('ユーザー情報取得エラー:', error);
    res.status(500).json({
      success: false,
      message: 'ユーザー情報の取得に失敗しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// パスワード更新
exports.updatePassword = async (req, res) => {
  try {
    // パスワードフィールドを含むユーザーを取得
    const user = await User.findById(req.user.id).select('+password');

    // 現在のパスワードを確認
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
      return res.status(401).json({
        success: false,
        message: '現在のパスワードが正しくありません'
      });
    }

    // 新しいパスワードを設定
    user.password = req.body.newPassword;
    await user.save();

    // 新しいトークンでログイン
    sendTokenResponse(user, 200, res);
  } catch (error) {
    logger.error('パスワード更新エラー:', error);
    res.status(500).json({
      success: false,
      message: 'パスワードの更新に失敗しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
