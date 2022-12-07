import https from 'https';
import cheerio from 'cheerio';
import { parseDate, sleep } from '../utils';
import fs from 'fs';
import type { Comment } from '../types';

interface CommentPaginator {
  tpl: string;
  meta: {
    last_page: number;
  };
}

const options = {
  hostname: 'm.fmkorea.com',
  port: 443,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

function getCommentsPerPage(board: string, post: string, page: number) {
  return new Promise<CommentPaginator>((resolve, reject) => {
    const req = https.request(options, function (res) {
      let data = '';

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        try {
          const body = JSON.parse(data);
          if (body.comment_page_navigation) {
            body.meta = { last_page: body.comment_page_navigation.last_page };
          } else {
            body.meta = { last_page: 1 };
          }

          resolve(body);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', function (e) {
      reject(e);
    });

    const payload = `midforconfig=${board}&document_srl=${post}&cpage=${page}&m=1&tpl_json_encode=1&module=board&act=dispBoardContentCommentList`;
    req.write(payload);
    req.end();
  });
}

export async function getComments(board: string, post: string, postMeta: { postDate: string; postLink: string; postTitle: string }) {
  const comments: Comment[] = [];

  let page = 1;

  let next = true;
  console.log(`- crawl comments for '${postMeta.postTitle}'`);
  while (next) {
    console.log('  - comment page: ', page);

    const paginator = await getCommentsPerPage(board, post, page);

    const $ = cheerio.load(paginator.tpl);

    $('.fdb_lst_ul .fdb_itm:not(.comment-2)').each((i, e) => {
      const commentEl = $(e);

      const author = commentEl.find('[class^="member"]').text().trim();
      const contentEl = commentEl.find('.xe_content');
      contentEl.find('.findParent').remove();
      const content = contentEl.text().trim();
      const date = parseDate(commentEl.find('.date').text().trim()).toISOString();

      const comment: Comment = {
        author,
        content,
        date,
        ...postMeta,
      };

      comments.push(comment);
    });

    console.log('    - crawled comments...: ', comments.length);

    if (page >= paginator.meta.last_page) {
      next = false;
    } else {
      page++;
      await sleep(100);
    }
  }

  console.log('  - total comments: ', comments.length);

  return comments;
}
