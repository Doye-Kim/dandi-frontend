import { Dimensions } from 'react-native';

/**
 * 디자인 기준 화면 사이즈 (가로 기준)
 */
const baseDesignScreenWidth = 372;
const baseDesignScreenHeight = 804;
const { width, height } = Dimensions.get('window');

/**
 * 모바일 화면 크기에 맞게 조절된 사이즈를 반환 해주는 함수
 * @param baseDesignElementSize 디자인 기준 개체 사이즈
 * @returns 화면 비율에 맞게 조절된 크기를 반환
 */
function responsive(baseDesignElementSize: number): number {
  const screenRatio = width / baseDesignScreenWidth;

  return baseDesignElementSize * screenRatio;
}
function responsiveVertical(baseDesignElementSize: number): number {
  const screenRatio = height / baseDesignScreenHeight;

  return baseDesignElementSize * screenRatio;
}
export { responsive, responsiveVertical };
