/**
 * アプリケーションのテーマ設定
 * ブランドカラーやテーマに関する定数を定義
 */

export const BRAND_COLORS = {
  // メインカラー
  primary: '#4A6FDC', // 知識と信頼を表現する青色
  
  // セカンダリカラー
  secondary: '#5ECE7B', // 成長と達成を表す緑色
  
  // アクセントカラー
  accent: '#FF7E4B', // モチベーションと活力を表すオレンジ色
  
  // コントラストカラー
  contrast: '#2D3748', // テキストや重要な要素に使用する暗い色
  
  // バックグラウンドカラー
  background: {
    primary: '#F7FAFC', // メインの背景色（明るい灰色）
    secondary: '#FFFFFF', // セカンダリの背景色（白）
    accent: '#EBF4FF', // アクセント背景色（薄い青）
  },
  
  // テキストカラー
  text: {
    primary: '#2D3748', // メインテキスト色
    secondary: '#718096', // 二次的なテキスト色
    light: '#A0AEC0', // 薄いテキスト色
    white: '#FFFFFF', // 白テキスト（暗い背景用）
  },
  
  // ボーダーカラー
  border: '#E2E8F0',
  
  // ステータスカラー
  status: {
    success: '#48BB78', // 成功
    warning: '#F6AD55', // 警告
    error: '#E53E3E', // エラー
    info: '#4299E1', // 情報
  }
};

// フォントサイズの定義
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// スペーシングの定義
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// 境界線の半径（角丸）
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// シャドウの定義
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
};
