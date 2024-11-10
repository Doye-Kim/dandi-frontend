export const ModalMessages = {
  DELETE_ITEM: {
    title: '소지품 삭제',
    content: '모든 가방 및 서랍에서 삭제됩니다. 정말 삭제하시겠습니까?',
    rightButton: '삭제',
    leftButton: '취소',
  },
  MAKE_CUSTOM_BAG: {
    title: '나만의 가방 만들기',
    content: '기존 가방에서 소지품을 복사해올까요?',
    rightButton: '네',
    leftButton: '아니요',
  },
  DELETE_BAG: {
    title: '가방 삭제',
    content: '가방을 삭제하시겠습니까? 담겨 있던 소지품은 삭제되지 않습니다.',
    rightButton: '삭제',
    leftButton: '취소',
  },
};

export const ErrorMessages: { [key: string]: string } = {
  E000: '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.',
  SELECT_BAG: '가방을 선택해 주세요',
};

export const SharedErrorMessages = {
  AUTH_ERROR: '사용자 인증에 문제가 생겼습니다. 재로그인 해주세요',
};

export type ModalCategory = keyof typeof ModalMessages;
