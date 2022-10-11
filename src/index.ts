import fs from 'fs';
import { crawlBestLinks, crawlComments } from './dcinside';

(async () => {
  const links = await crawlBestLinks();
  console.log('links: ', links);
  const comments = await crawlComments(links, 3333);
  console.log('comments: ', comments);

  fs.writeFileSync('comments.json', JSON.stringify(comments));
})();
