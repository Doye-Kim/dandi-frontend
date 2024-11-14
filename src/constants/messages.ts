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
  WITHDRAW: {
    title: '회원 탈퇴',
    content: '정말 탈퇴하시겠습니까?',
    rightButton: '탈퇴',
    leftButton: '취소',
  },
};

export const ErrorMessages: { [key: string]: string } = {
  E000: '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.',
  E999: '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.',

  E101: '인증 메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
  E102: '유효하지 않은 사용자입니다. 회원 정보를 확인해 주세요.',
  E103: '이미 사용 중인 이메일 주소입니다. 다른 이메일 주소를 입력해 주세요.',
  E104: '유효하지 않은 이메일 형식입니다. 이메일 주소를 다시 확인해 주세요.',
  E105: '신청되지 않은 회원가입 요청입니다. 올바른 절차로 가입을 시도해 주세요.',
  E106: '인증 번호가 만료되었거나 존재하지 않습니다. 새 인증 번호를 요청해 주세요.',
  E107: '올바르지 않은 인증 번호입니다. 정확한 인증 번호를 입력해 주세요.',
  E108: '유효하지 않거나 만료된 토큰입니다. 다시 로그인해 주세요.',
  E109: '인증 정보가 만료되었습니다. 다시 로그인해 주세요.',
  E110: '이메일 인증이 완료되지 않았습니다. 이메일을 확인하고 인증을 완료해 주세요.',

  E111: '가방의 최대 개수를 초과했습니다. 기존 가방을 삭제하고 다시 시도해 주세요.',
  E112: '이미 사용 중인 가방 이름입니다. 다른 이름을 사용해 주세요.',
  E113: '가방을 찾을 수 없습니다. 가방 정보를 확인해 주세요.',
  E114: '해당 가방은 사용자의 소유가 아닙니다. 올바른 가방을 선택해 주세요.',
  E115: '기본 가방은 삭제할 수 없습니다.',
  E116: '가방에 아이템을 더 추가할 수 없습니다. 최대 20개까지 가능합니다.',
  E117: '이미 사용 중인 아이템 이름입니다. 다른 이름을 사용해 주세요.',
  E118: '아이템 개수 제한을 초과했습니다. 최대 50개까지 가능합니다.',
  E119: '삭제할 아이템을 찾을 수 없습니다. 아이템 정보를 확인해 주세요.',
  E120: '해당 아이템은 사용자의 소유가 아닙니다. 올바른 아이템을 선택해 주세요.',

  E201: '확인할 수 없는 이동입니다. 이동 정보를 확인해 주세요.',
  E202: '이미 종료된 이동입니다. 이동 상태를 다시 확인해 주세요.',
  E203: '스냅샷을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.',
  E204: '좌표 값을 변환할 수 없습니다. 입력 값을 확인해 주세요.',
  E205: '확인할 수 없는 날짜입니다. 날짜 형식을 확인해 주세요.',

  LOGIN_ERROR: '아이디 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.',
  SELECT_BAG: '가방을 선택해 주세요.',
  MAIL_ERROR: '메일 전송에 실패했습니다.',
  EMPTY_NAME: '이름을 입력해 주세요.',
  NO_NEXT: '다음 이동이 없어요',
  NO_PREV: '이전 이동이 없어요',
};

export const NotiTitleMessages: { [key: string]: string } = {
  route: '잠깐, 소지품은 다 챙기셨나요?',
};

export const NotiBodyMessages: { [key: string]: string } = {
  route: '체크리스트를 작성해 보세요!',
};

export const SharedErrorMessages = {
  AUTH_ERROR: '사용자 인증에 문제가 생겼습니다. 재로그인 해주세요',
};

export type ModalCategory = keyof typeof ModalMessages;
