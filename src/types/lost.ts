// 알람 데이터 타입 정의
interface AlertData {
  id: number;
  memberId: number;
  createdAt: string;
  confirmation: boolean;
  title: string;
  lostItemId?: number;
  foundItemId?: number;
  commentId?: number;
  routeId?: number;
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

export type { AlertData, PickupDetailData, CommentData };
