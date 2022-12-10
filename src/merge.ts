import fs from 'fs';
import dayjs from 'dayjs';
import { Comment, Post } from './types';

function merge(dir: string, out: string) {
  console.log(`=== merging ${dir} ===`);

  const path = dir;

  const files = fs.readdirSync(path);
  const gitignoreIdx = files.findIndex(f => f === '.gitignore');
  if (gitignoreIdx > -1) {
    files.splice(gitignoreIdx, 1);
  }

  if (files.length === 0) {
    console.log('데이터가 없습니다!');
    return;
  }

  console.log('게시글: ', files.length);

  let comments: Comment[] = [];
  for (const file of files) {
    const comment: Comment = JSON.parse(fs.readFileSync(`${path}/${file}`).toString());
    comments = comments.concat(comment);
  }

  comments.sort((a, b) => {
    return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
  });

  console.log('댓글: ', comments.length);
  console.log(
    '게시글 기간: ',
    dayjs(comments[comments.length - 1].postDate).format('YYYY-MM-DD HH:mm:ss'),
    '~',
    dayjs(comments[0].postDate).format('YYYY-MM-DD HH:mm:ss')
  );

  const length = comments.length / 2;
  fs.writeFileSync(out + '1', JSON.stringify(comments.slice(undefined, length)));
  fs.writeFileSync(out + '2', JSON.stringify(comments.slice(length)));

  // for (const file of files) {
  //   fs.unlinkSync(`${path}/${file}`);
  // }
}

(() => {
  merge('./comments/fmkorea', './comments/fmkorea.json');
  // merge('./comments/dcinside', './comments/dcinside.json');
})();
