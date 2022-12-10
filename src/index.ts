import fs from 'fs';
// import { crawlBestLinks, crawlComments } from './dcinside';
import * as fmkorea from './fmkorea/fmkorea';
import * as dcinside from './dcinside/dcinside';
import type { Post } from './types';

/**
 *
 * DCINSIDE
 *
 */
// async function getPosts() {
//   const path = `./posts/dcinside.json`;

//   const links = await dcinside.crawlBestLinks(85, 225);
//   console.log('links: ', links.length);

//   fs.writeFileSync(path, JSON.stringify(links, null, 2));

//   return path;
// }

// async function getComments(postsPath: string) {
//   const commentsPath = './comments/dcinside';

//   const posts: Post[] = JSON.parse(fs.readFileSync(postsPath).toString());

//   await dcinside.crawlComments(posts, commentsPath);

//   console.log(`게시글 별 댓글이 '${commentsPath}'에 저장되었습니다.`);
//   console.log(`댓글을 합쳐 모든 댓글로 만드려면 'npm run merge'를 실행하세요.`);
// }

// (async () => {
//   const path = await getPosts();
//   await getComments(path);
// })();

/**
 *
 * FMKOREA
 *
 */
// async function getPosts() {
//   const path = `./posts/fmkorea.json`;

//   const links = await fmkorea.crawlBestLinks(855, 2200);
//   console.log('links: ', links.length);

//   fs.writeFileSync(path, JSON.stringify(links, null, 2));

//   return path;
// }

async function getComments(postsPath: string) {
  const commentsPath = './comments/fmkorea';

  const posts: Post[] = JSON.parse(fs.readFileSync(postsPath).toString());

  await fmkorea.crawlComments(posts, commentsPath);

  console.log(`게시글 별 댓글이 '${commentsPath}'에 저장되었습니다.`);
  console.log(`댓글을 합쳐 모든 댓글로 만드려면 'npm run merge'를 실행하세요.`);
}

(async () => {
  // const path = await getPosts();
  const path = './posts/fmkorea_remained.json';
  await getComments(path);
})();
