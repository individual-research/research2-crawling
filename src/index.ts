import fs from 'fs';
// import { crawlBestLinks, crawlComments } from './dcinside';
import * as fmkorea from './fmkorea/fmkorea';
import type { Post } from './types';

async function getPosts() {
  const path = `./posts/fmkorea.json`;

  const links = await fmkorea.crawlBestLinks(1, 100);
  console.log('links: ', links.length);

  fs.writeFileSync(path, JSON.stringify(links, null, 2));

  return path;
}

async function getComments(postsPath: string) {
  const commentsPath = './comments/미분류';

  const posts: Post[] = JSON.parse(fs.readFileSync(postsPath).toString());

  await fmkorea.crawlComments(posts, commentsPath);

  console.log(`게시글 별 댓글이 '${commentsPath}'에 저장되었습니다.`);
  console.log(`댓글을 합쳐 모든 댓글로 만드려면 'npm run merge'를 실행하세요.`);
}

(async () => {
  const path = await getPosts();
  await getComments(path);
})();
