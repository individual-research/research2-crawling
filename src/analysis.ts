import fs from 'fs';
import dayjs from 'dayjs';
import { Comment } from './types';

const target = './comments/demo_dcinside_20221203_20221207_2022-12-05.json';

(() => {
  //
  const comments: Comment[] = JSON.parse(fs.readFileSync(target).toString());

  const commentsMin = comments.reduce((prev, cur) => {
    const date = dayjs(cur.date);
    if (prev > date) {
      prev = date;
    }
    return prev;
  }, dayjs());

  const commentsMax = comments.reduce((prev, cur) => {
    const date = dayjs(cur.date);
    if (prev < date) {
      prev = date;
    }
    return prev;
  }, dayjs('2005-01-01'));

  const postsMin = comments.reduce((prev, cur) => {
    const date = dayjs(cur.postDate);
    if (prev > date) {
      prev = date;
    }
    return prev;
  }, dayjs());

  const postsMax = comments.reduce((prev, cur) => {
    const date = dayjs(cur.postDate);
    if (prev < date) {
      prev = date;
    }
    return prev;
  }, dayjs('2005-01-01'));

  const format = (date: dayjs.Dayjs) => {
    return date.format('YYYY-MM-DD HH:mm:ss');
  };

  console.log(`comments\n${format(commentsMin)} ~ ${format(commentsMax)}`);
  console.log(`posts\n${format(postsMin)} ~ ${format(postsMax)}`);
})();
