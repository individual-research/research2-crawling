import fs from 'fs';
// import { crawlBestLinks, crawlComments } from './dcinside';
import { crawlBestLinks, crawlComments } from './hangang';
import type { Comment, Post } from './types/comments';

// (async () => {
//   const keyword = '그알';
//   const target = 'title_content';

//   const links = await crawlBestLinks(keyword, target, 6, 8);
//   console.log('links: ', links);

//   fs.writeFileSync(`./output/${keyword}.json`, JSON.stringify(links, null, 2));
// })();

(async () => {
  const posts: Post[] = JSON.parse(fs.readFileSync('./output/hangang.json').toString());

  const comments = await crawlComments(posts);

  fs.writeFileSync('./comments.json', JSON.stringify(comments));
  console.log('Comments Saved.');
})();
