# Qualification-Roadmap

<!-- ロゴを中央配置 -->
![Qualification Roadmap Logo](./frontend/public/assets/logo.svg)

<p align="center">
  <b>資格取得をサポートするロードマップアプリケーション</b><br>
  資格試験の学習計画と進捗管理を効率化し、目標達成をサポートします。
</p>

## 技術スタック / Tech Stack

<p align="center">
  <!-- フロントエンド -->
  ![React Native](https://img.shields.io/badge/-React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  <!-- バックエンド -->
  ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
  <!-- ツール -->
  ![Git](https://img.shields.io/badge/-Git-F05032?style=for-the-badge&logo=git&logoColor=white)
</p>

## 詳細な技術スタック / Detailed Tech Stack

### フロントエンド / Frontend
- React Native
- React Navigation
- JavaScript
- AsyncStorage
- レスポンシブデザイン (normalize.js)

### バックエンド / Backend
- Node.js
- Express.js
- MongoDB
- JWT認証
- RESTful API

### スタイリング / Styling
- カスタムUIコンポーネント
- レスポンシブデザイン
- クロスプラットフォーム対応

## 機能概要 / Overview

Qualification Roadmapは、以下の機能を提供することで、ユーザーの資格取得をサポートするアプリケーションです：

- 資格試験の情報管理
- 学習進捗のマイルストーン設定
- 学習記録の保存と分析
- リマインダー機能
- モバイル対応UI（レスポンシブデザイン）

## 機能 / Features

-  **試験情報管理** - 資格試験の基本情報を登録・管理
-  **マイルストーン設定** - 学習計画を立て、進捗を視覚的に確認
-  **学習記録** - 日々の学習内容と時間を記録し、分析
-  **リマインド機能** - 重要な日程や学習予定の通知
-  **レスポンシブデザイン** - 様々なデバイスサイズに最適化されたUI
-  **進捗分析** - 学習状況のグラフ表示と分析

## レスポンシブデザイン対応 / Responsive Design

このアプリケーションは様々なデバイスサイズに対応したレスポンシブデザインを実装しています。

### 実装内容 / Implementation

- 画面サイズと向きに応じた動的レイアウト調整
- タッチ操作の最適化（タッチ領域の拡大、フィードバックの改善）
- フォントサイズ・余白・UI要素の自動調整
- モバイルフレンドリーなナビゲーション

### 対応デバイス / Supported Devices

- スマートフォン（縦向き・横向き）
- タブレット（縦向き・横向き）
- デスクトップ

## プロジェクト構成 / Project Structure

```
./
├── frontend/                       # フロントエンドコード
│   ├── src/                       # ソースコードディレクトリ
│   │   ├── components/            # UIコンポーネント
│   │   │   ├── BookInfo.js        # 書籍情報コンポーネント
│   │   │   ├── ExamFee.js         # 試験費用コンポーネント
│   │   │   ├── CountdownTimer.js  # カウントダウンタイマー
│   │   │   ├── StudyLog.js        # 学習記録コンポーネント
│   │   │   ├── Reminder.js        # リマインダーコンポーネント
│   │   │   └── Milestone.js       # マイルストーンコンポーネント
│   │   │
│   │   ├── screens/               # 画面コンポーネント
│   │   │   ├── HomeScreen.js      # ホーム画面
│   │   │   ├── SettingsScreen.js  # 設定画面
│   │   │   ├── StudyLogScreen.js  # 学習記録画面
│   │   │   └── RemindersScreen.js # リマインダー画面
│   │   │
│   │   ├── api/                   # APIクライアント
│   │   │   └── api.js             # API関数
│   │   │
│   │   ├── utils/                 # ユーティリティ
│   │   │   └── responsive.js      # レスポンシブ対応ユーティリティ
│   │   │
│   │   ├── redux/                 # 状態管理
│   │   │   ├── actions/           # アクション
│   │   │   ├── reducers/          # リデューサー
│   │   │   └── store.js           # ストア設定
│   │   │
│   │   ├── assets/                # アセット
│   │   │   ├── logo.svg           # ロゴ
│   │   │   └── icons/             # アイコン
│   │   │
│   │   └── App.js                 # アプリエントリーポイント
│   │
│   ├── public/                    # 静的ファイル
│   │   └── index.html             # メインHTML
│   │
│   ├── app.json                   # アプリ設定
│   ├── package.json               # 依存関係
│   └── index.js                   # エントリーポイント
│
├── backend/                        # バックエンドコード
│   ├── src/                       # ソースコード
│   │   ├── models/                # データモデル
│   │   │   ├── Book.js            # 書籍モデル
│   │   │   ├── Exam.js            # 試験モデル
│   │   │   ├── User.js            # ユーザーモデル
│   │   │   ├── StudyLog.js        # 学習記録モデル
│   │   │   ├── Reminder.js        # リマインダーモデル
│   │   │   └── Milestone.js       # マイルストーンモデル
│   │   │
│   │   ├── routes/                # APIルート
│   │   │   ├── books.js           # 書籍API
│   │   │   ├── exams.js           # 試験API
│   │   │   ├── users.js           # ユーザーAPI
│   │   │   ├── studyLogs.js       # 学習記録API
│   │   │   ├── reminders.js       # リマインダーAPI
│   │   │   └── milestones.js      # マイルストーンAPI
│   │   │
│   │   ├── controllers/           # コントローラー
│   │   │   ├── booksController.js # 書籍コントローラー
│   │   │   ├── examsController.js # 試験コントローラー
│   │   │   ├── usersController.js # ユーザーコントローラー
│   │   │   ├── studyLogsController.js # 学習記録コントローラー
│   │   │   ├── remindersController.js # リマインダーコントローラー
│   │   │   └── milestonesController.js # マイルストーンコントローラー
│   │   │
│   │   ├── config/                # 設定ファイル
│   │   │   └── db.js              # データベース設定
│   │   │
│   │   └── server.js              # サーバーエントリーポイント
│   │
│   └── package.json               # 依存関係
│
└── README.md                      # プロジェクトドキュメント
```

## セットアップ手順 / Setup Instructions

### バックエンド / Backend

```bash
# リポジトリをクローン
git clone https://github.com/kimpaio/Qualification-Roadmap.git
cd Qualification-Roadmap/backend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

### フロントエンド / Frontend

```bash
# フロントエンドディレクトリに移動
cd ../frontend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

### モバイルでのテスト方法 / Mobile Testing

- レスポンシブデザインをテストするには、ブラウザの開発者ツールでモバイル表示をシミュレーションするか、実際のモバイルデバイスでアクセスしてください。
- 様々な画面サイズと向きでのテストを推奨します。

## 開発者向け情報 / Developer Information

### レスポンシブデザイン実装 / Responsive Design Implementation

- `responsive.js` - 画面サイズに応じたスタイル調整のためのユーティリティ関数を提供
- コンポーネントは `Dimensions` APIを使用して画面の向きや大きさの変更を検出
- デバイスサイズを基準にした正規化されたサイズ計算（normalize関数）を使用

### API仕様 / API Specification

バックエンドAPIは以下のエンドポイントを提供しています：

- `GET /api/exams` - 全ての試験情報を取得
- `POST /api/exams` - 新しい試験情報を作成
- `GET /api/exams/:id` - 特定のIDの試験情報を取得
- `PUT /api/exams/:id` - 特定のIDの試験情報を更新
- `DELETE /api/exams/:id` - 特定のIDの試験情報を削除

（他のエンドポイントについても同様の形式で実装）

## 必要条件 / Requirements

- Node.js 14.0.0以上
- npm 6.0.0以上
- MongoDB

## 貢献 / Contributing

プロジェクトへの貢献は歓迎します。プルリクエストを送る前に、既存の問題を確認し、新しい機能や修正について議論してください。

## ライセンス / License

MITライセンス
