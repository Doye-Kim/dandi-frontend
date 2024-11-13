// 알람 데이터 타입 정의
export interface AlertData {
  id: number;
  memberId: number;
  createdAt: string;
  confirmation: boolean;
  title: string;
  lostItemId?: number;
  foundItemId?: number;
  commentId?: number;
  routeId?: number;
  body?: string;
}
// 습득물 상세정보 데이터 타입 정의
export interface PickupDetailData {
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
  foundAt: string;
  address: string;
}
// SOS 상세정보 데이터 타입 정의
export interface SOSDetailData {
  id: number;
  situationDescription: string;
  itemDescription: string;
  images: string[];
  lostAt: string; // 날짜 타입으로 변경 필요
  memberId: number;
}
// 댓글 데이터 타입 정의
export interface CommentData {
  id: number;
  writerId: number;
  parentId: number | null;
  content: string;
  createdAt: string;
  nickname: string;
}
