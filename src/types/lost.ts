// 분실물, 습득물 목록 데이터 타입 정의
interface AlertListData {
  id: number;
  type: string;
  read: boolean;
  title: string;
  date: string;
}
// 습득물 상세정보 데이터 타입 정의
interface PickupDetailData {
  id: number;
  description: string;
  foundLocation: {
    lat: number;
    lon: number;
  };
  image: string;
  memberId: number;
  savePoint: string;
  type: string;
}

// 댓글 데이터 타입 정의
interface CommentData {
  id: number;
  nickname: string;
  content: string;
  date: string;
}

export type { AlertListData, PickupDetailData, CommentData };
