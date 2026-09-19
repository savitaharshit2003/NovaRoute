import {Dimensions, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} =
  Dimensions.get('window');

const BASE_WIDTH = 375;

export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

export const moderateScale = (
  size: number,
  factor: number = 0.5,
): number => {
  return size + (scale(size) - size) * factor;
};

export const normalizeFont = (size: number): number => {
  const newSize = scale(size);

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;