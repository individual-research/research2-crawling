import fs from 'fs';
import { Post } from './types/comments';

(() => {
  const files = fs.readdirSync('./comments/미분류');
  console.log(files.length);

  let comments: any[] = [];
  for (const file of files) {
    if (file === '.gitignore') continue;
    const comment = JSON.parse(fs.readFileSync(`./comments/미분류/${file}`).toString());
    comments = comments.concat(comment);
  }

  console.log(comments.length);
  fs.writeFileSync('./merged.json', JSON.stringify(comments, null, 2));
})();

// (() => {
//   const keyword = '한강';

//   const files = fs.readdirSync('./comments/미분류');
//   const posts: Post[] = JSON.parse(fs.readFileSync(`./output/${keyword}.json`).toString());

//   const remained = posts.filter(p => {
//     let found = false;
//     for (const file of files) {
//       if (file === '.gitignore') continue;

//       const id = file.split('.')[0];
//       found = p.link.includes(id);
//       if (found) break;
//     }

//     return !found;
//   });

//   console.log(remained.length, '/', posts.length);

//   fs.writeFileSync('./remained.json', JSON.stringify(remained));
// })();
