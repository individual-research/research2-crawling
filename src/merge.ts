import fs from 'fs';
import dayjs from 'dayjs';
import { Comment, Post } from './types';

(() => {
  const path = './comments/미분류';

  const files = fs.readdirSync(path);
  const gitignoreIdx = files.findIndex(f => f === '.gitignore');
  if (gitignoreIdx > -1) {
    files.splice(gitignoreIdx, 1);
  }

  if (files.length === 0) {
    console.log('데이터가 없습니다!');
    process.exit();
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
  fs.writeFileSync('./comments/comments.json', JSON.stringify(comments, null, 2));

  for (const file of files) {
    fs.unlinkSync(`${path}/${file}`);
  }
})();
