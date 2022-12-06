import fs from 'fs';
// import { crawlBestLinks, crawlComments } from './dcinside';
import * as fmkorea from './fmkorea/fmkorea';
import type { Comment, Post } from './types';

// (async () => {
//   const links = await fmkorea.crawlBestLinks(1, 5);
//   console.log('links: ', links.length);

//   fs.writeFileSync(`./posts/fmkorea.json`, JSON.stringify(links, null, 2));
// })();

(async () => {
  const path = './comments/미분류';

  const posts: Post[] = JSON.parse(fs.readFileSync('./posts/fmkorea.json').toString());

  const comments = await fmkorea.crawlComments(posts, path);

  console.log(`게시글 별 댓글이 '${path}'에 저장되었습니다.`);
  console.log(`댓글을 합쳐 모든 댓글로 만드려면 'npm run merge'를 실행하세요.`);
})();
