import fs from 'fs';
import { Comment, Post } from './types/comments';

// (() => {
//   const files = fs.readdirSync('./comments/미분류');
//   console.log(files.length);

//   let comments: any[] = [];
//   for (const file of files) {
//     if (file === '.gitignore') continue;
//     const comment = JSON.parse(fs.readFileSync(`./comments/미분류/${file}`).toString());
//     comments = comments.concat(comment);
//   }

//   console.log(comments.length);
//   fs.writeFileSync('./merged.json', JSON.stringify(comments, null, 2));
// })();

// (() => {
//   const keyword = 'hangang';

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

// (() => {
//   const f1 = JSON.parse(fs.readFileSync('./output/실종-1.json').toString());
//   const f2 = JSON.parse(fs.readFileSync('./output/실종-2.json').toString());

//   const f3 = f1.concat(f2);

//   fs.writeFileSync('./output/실종.json', JSON.stringify(f3));

//   console.log(f3.length);
// })();

// (() => {
//   const keywords = ['경찰', '그알', '손정민', '실종', '한강'];

//   let merged: Comment[] = [];
//   for (const keyword of keywords) {
//     const comments = JSON.parse(fs.readFileSync(`./comments/${keyword}/comments.json`).toString());
//     merged = merged.concat(comments);
//   }

//   fs.writeFileSync('./total.json', JSON.stringify(merged, null, 2));
//   console.log(merged.length);
// })();

// (() => {
//   const comments: Comment[] = JSON.parse(fs.readFileSync(`./total.json`).toString());

//   const counts: { [author: string]: Comment[] } = {};
//   for (const comment of comments) {
//     if (!(comment.author in counts)) {
//       counts[comment.author] = [];
//     }
//     counts[comment.author].push(comment);
//   }

//   const result = Object.entries(counts);
//   result.sort((a, b) => b[1].length - a[1].length);

//   const result2 = result.map(e => ({ author: e[0], comments: e[1] }));
//   fs.writeFileSync('./total_distinct_author.json', JSON.stringify(result2, null, 2));
// })();

// (() => {
//   let total: Comment[] = JSON.parse(fs.readFileSync('./merged.json').toString());

//   total = total.map(c => {
//     const regex = /.*mid=(.+?(?=&)).*document_srl=(.+?(?=&)).*/;
//     const result = regex.exec(c.postLink);
//     if (result) {
//       c.postLink = `https://www.fmkorea.com/${result[1]}/${result[2]}`;
//     }
//     return c;
//   });

//   const set = new Set<string>(total.map(c => JSON.stringify(c)));
//   const result: Comment[] = [...set.values()].map(s => JSON.parse(s));

//   console.log(result.length);
//   fs.writeFileSync('./merged_distinct.json', JSON.stringify(result, null, 2));
// })();

(() => {
  const comments: (Comment & { no: number; percents: number[]; labels: string[] })[] = JSON.parse(fs.readFileSync(`./comments_labeled.json`).toString());

  const counts: { [author: string]: (Comment & { no: number; percents: number[]; labels: string[] })[] } = {};
  for (const comment of comments) {
    if (!(comment.author in counts)) {
      counts[comment.author] = [];
    }
    counts[comment.author].push(comment);
  }

  const result = Object.entries(counts);
  result.sort((a, b) => b[1].length - a[1].length);

  const result2 = result.map(e => ({ author: e[0], comments: e[1] }));
  console.log(result2.map(e => ({ ...e, comments: e.comments.length })));
  fs.writeFileSync('./comments_labeled_author.json', JSON.stringify(result2, null, 2));
})();

// (() => {
//   const files = fs.readdirSync('./output');

//   let comments: Comment[] = [];
//   for (const file of files) {
//     console.log(file);

//     const json = JSON.parse(fs.readFileSync(`./output/${file}`).toString());
//     comments = comments.concat(json);
//   }

//   fs.writeFileSync('./output/hangang.json', JSON.stringify(comments, null, 2));
// })();
