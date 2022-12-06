import dayjs from 'dayjs';

function parse(base: dayjs.Dayjs, dateStr: string): dayjs.Dayjs {
  const regex = /([0-9]{1,2}) (분|시간) 전/;

  const result = regex.exec(dateStr);
  if (!result) return dayjs(dateStr);

  const amount = Number.parseInt(result[1]);
  const type = result[2] === '분' ? 'minute' : 'hour';

  return base.subtract(amount, type);
}

export const parseDate = (dateStr: string, base: Date = new Date()) => {
  return parse(dayjs(base), dateStr);
};
