import fs from 'fs';
import { crawlBestLinks, crawlComments } from './dcinside';
// import { crawlBestLinks, crawlComments } from './fmkorea';

(async () => {
  const links = await crawlBestLinks(1, 10);
  console.log('links: ', links);
  const comments = await crawlComments(links, 10000);
  console.log('comments: ', comments.slice(0, 5));

  fs.writeFileSync('comments.json', JSON.stringify(comments));
})();
