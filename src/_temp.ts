import fs from 'fs';

const files = fs.readdirSync('./comments');

console.log(files);

let comments: any[] = [];
for (const file of files) {
  const comment = JSON.parse(fs.readFileSync(`./comments/${file}`).toString());
  comments = comments.concat(comment);
}

console.log(comments.length);
fs.writeFileSync('./comments.json', JSON.stringify(comments, null, 2));
