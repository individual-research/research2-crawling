import fs from 'fs';
import dayjs from 'dayjs';
import { Comment } from './types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const json = require('big-json');

function split(comments: Comment[], date: dayjs.Dayjs, prefix: string) {
  const dist = `./comments/split/${prefix}_${date.format('YYYY-MM-DD')}.json`;

  const filtered = comments.filter(c => {
    return dayjs(c.postDate).isSame(date, 'date');
  });
  filtered.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());

  const format = (date: dayjs.Dayjs) => {
    return date.format('YYYY-MM-DD HH:mm:ss');
  };

  console.log(`comments for ${format(date)} ${filtered.length} saved at "${dist}"`);
  console.log(`-- ${format(dayjs(filtered[0].postDate))} ~ ${format(dayjs(filtered[filtered.length - 1].postDate))}`);

  fs.writeFileSync(dist, JSON.stringify(filtered, null, 2));
}

const community = 'dcinside';
const target = `./comments/${community}.json`;

(() => {
  const fileStream = fs.createReadStream(target);
  const parseStream = json.createParseStream();

  parseStream.on('data', (comments: Comment[]) => {
    let date = dayjs('2022-10-20');
    while (date.isBefore('2022-11-21', 'date')) {
      split(comments, date, 'dcinside');

      date = date.add(1, 'day');
    }
  });

  fileStream.pipe(parseStream);
})();
