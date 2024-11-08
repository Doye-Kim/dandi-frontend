const splitDate = (data: Date) => {
  const year = data.getFullYear();
  const month = data.getMonth() + 1;
  const date = data.getDate();
  const day = data.getDay();

  return { year, month, date, day };
};
const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

const convertDateFormat = (data: Date) => {
  const { year, month, date } = splitDate(data);
  return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(
    2,
    '0',
  )}`;
};

const convertDateTimeFormat = (data: Date) => {
  const { year, month, date, day } = splitDate(data);
  return `${String(year).slice(2)}.${String(month).padStart(2, '0')}.${String(
    date,
  ).padStart(2, '0')}(${daysOfWeek[day]}) ${String(data.getHours()).padStart(
    2,
    '0',
  )}:${String(data.getMinutes()).padStart(2, '0')}`;
};

// #todo: 파라미터 형식을 string으로 바꿔서 함수 내부에서 Date 형식으로 변환하거나
// 호출할 때 Date 형식으로 하거나 둘 중 하나만 하기
function getTimeDifference(startTime: Date, endTime: Date) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // 밀리초 단위 차이 계산
  const differenceInMilliseconds = end.getTime() - start.getTime();

  // 시간과 분으로 변환
  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60),
  );
  const hours = Math.floor(differenceInMinutes / 60);
  const minutes = differenceInMinutes % 60;

  // 시간과 분을 조건에 따라 반환
  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  } else {
    return `${minutes}분`;
  }
}

const changeDateByDays = (data: Date, days: number) => {
  const newDate = new Date(data);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const isSameOrAfter = (today: Date, data: Date) => {
  return (
    today.getFullYear() <= data.getFullYear() &&
    today.getMonth() <= data.getMonth() &&
    today.getDate() <= data.getDate()
  );
};

export {
  convertDateFormat,
  changeDateByDays,
  isSameOrAfter,
  convertDateTimeFormat,
  getTimeDifference,
};
