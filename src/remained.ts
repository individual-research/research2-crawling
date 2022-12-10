import fs from 'fs';
import { Post } from './types';

const path = './comments/fmkorea';
const postsPath = './posts/fmkorea.json';

(() => {
  const files = fs.readdirSync(path);

  const posts: Post[] = JSON.parse(fs.readFileSync(postsPath).toString());

  const regex = /\/.+\/([0-9]+)/;
  const remained = posts.filter(p => {
    const result = regex.exec(p.link);
    if (result) {
      return !files.includes(`${result[1]}.json`);
    } else {
      console.log('ERROR!');
      return false;
    }
  });

  console.log(remained);
  fs.writeFileSync('./posts/fmkorea_remained.json', JSON.stringify(remained, null, 2));
})();
