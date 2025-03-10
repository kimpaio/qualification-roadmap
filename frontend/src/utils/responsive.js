import { Dimensions, Platform, PixelRatio } from 'react-native';

// デバイス情報を取得
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// デバイスの画面サイズに基づいたスケールファクターを計算
const scale = SCREEN_WIDTH / 375; // iPhoneの標準サイズ (375x667) を基準

/**
 * ピクセル単位のサイズをデバイスの画面サイズに応じて調整する
 * @param {number} size - 基準となるピクセルサイズ
 * @return {number} デバイスに応じたスケーリングされたサイズ
 */
export const normalize = (size) => {
  const newSize = size * scale;
  // iOSとAndroidで処理を少し変える
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

/**
 * 現在のデバイスがタブレットかどうかを判定
 * 一般的に7インチ以上の画面サイズをタブレットと見なす
 * @return {boolean} タブレットの場合true、スマートフォンの場合false
 */
export const isTablet = () => {
  // 画面の対角線の長さをインチ単位で計算
  const pixelDensity = PixelRatio.get();
  const screenWidthInches = SCREEN_WIDTH / (pixelDensity * 160);
  const screenHeightInches = SCREEN_HEIGHT / (pixelDensity * 160);
  const diagonalSizeInches = Math.sqrt(Math.pow(screenWidthInches, 2) + Math.pow(screenHeightInches, 2));
  
  // 7インチ以上をタブレットと見なす
  return diagonalSizeInches >= 7;
};

/**
 * 現在のデバイスの向き（縦向き・横向き）を判定
 * @return {string} 'portrait'（縦向き）または'landscape'（横向き）
 */
export const getOrientation = () => {
  return SCREEN_WIDTH < SCREEN_HEIGHT ? 'portrait' : 'landscape';
};

/**
 * 画面サイズに応じたブレークポイントを定義
 */
export const breakpoints = {
  smallPhone: 320,  // iPhone SE等の小さいスマートフォン
  phone: 375,      // 標準的なスマートフォン
  largePhone: 414, // iPhone Plus/Max等の大きいスマートフォン
  tablet: 768,     // iPad Mini/Air等のタブレット
  largeTablet: 1024 // iPad Pro等の大きいタブレット
};

/**
 * 現在の画面幅に合ったブレークポイント名を取得
 * @return {string} ブレークポイント名
 */
export const getBreakpointName = () => {
  const width = SCREEN_WIDTH;
  
  if (width < breakpoints.smallPhone) return 'xsmall';
  if (width < breakpoints.phone) return 'small';
  if (width < breakpoints.largePhone) return 'medium';
  if (width < breakpoints.tablet) return 'large';
  if (width < breakpoints.largeTablet) return 'xlarge';
  return 'xxlarge';
};

/**
 * 現在の画面サイズに応じたスタイルを取得
 * @param {Object} styles - 各ブレークポイントに対応したスタイルオブジェクト
 * @return {Object} 現在のブレークポイントに対応したスタイル
 */
export const responsiveStyle = (styles) => {
  const breakpoint = getBreakpointName();
  return styles[breakpoint] || styles.medium || {};
};

/**
 * 画面サイズの変更を監視するためのイベントリスナーを登録
 * @param {Function} callback - 画面サイズが変更された時に呼び出されるコールバック関数
 * @return {Function} イベントリスナーの登録を解除するための関数
 */
export const addDimensionsListener = (callback) => {
  const subscription = Dimensions.addEventListener('change', ({ window }) => {
    const { width, height } = window;
    callback(width, height);
  });
  
  // クリーンアップ関数を返す
  return () => subscription.remove();
};
