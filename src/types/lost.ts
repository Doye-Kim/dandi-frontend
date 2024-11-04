// 분실물, 습득물 목록 데이터 타입 정의
interface AlertListData {
  id: number;
  type: string;
  read: boolean;
  title: string;
  date: string;
}

// 댓글 데이터 타입 정의
interface CommentData {
  id: number;
  nickname: string;
  content: string;
  date: string;
}

export type { AlertListData, CommentData };
