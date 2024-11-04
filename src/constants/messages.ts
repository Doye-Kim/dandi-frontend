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
export type ModalCategory = keyof typeof ModalMessages;
