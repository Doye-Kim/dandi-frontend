const splitDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return { year, month, day };
};

const convertDateFormat = (date: Date) => {
  const { year, month, day } = splitDate(date);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`;
};

const changeDateByDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const isSameOrAfter = (today: Date, date: Date) => {
  return (
    today.getFullYear() <= date.getFullYear() &&
    today.getMonth() <= date.getMonth() &&
    today.getDate() <= date.getDate()
  );
};

export { convertDateFormat, changeDateByDays, isSameOrAfter };
