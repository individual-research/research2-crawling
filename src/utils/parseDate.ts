import dayjs from 'dayjs';

function toDayjs(dateStr: string) {
  let result = dayjs(dateStr);
  if (result.year() === 2001) {
    result = result.set('year', dayjs().year());
  }

  return result;
}

function parse(base: dayjs.Dayjs, dateStr: string): dayjs.Dayjs {
  const regex = /([0-9]{1,2}) (분|시간) 전/;

  const result = regex.exec(dateStr);
  if (!result) return toDayjs(dateStr);

  const amount = Number.parseInt(result[1]);
  const type = result[2] === '분' ? 'minute' : 'hour';

  return base.subtract(amount, type);
}

export const parseDate = (dateStr: string, base: Date = new Date()) => {
  return parse(dayjs(base), dateStr);
};
