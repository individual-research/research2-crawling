import { Comment } from '@src/types';
import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';
import { parseDate, sleep } from '@src/utils';

interface Paginator {
  data: Comment[];
  hasNext: boolean;
}

/** axios instance for m.dcinside.com */
const http = axios.create({
  baseURL: 'https://m.dcinside.com/',
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36',
  },
});

async function getCommentsPerPage(
  board: string,
  post: string,
  page: number,
  postMeta: { postDate: string; postLink: string; postTitle: string }
): Promise<Paginator> {
  const response = await http.post('/ajax/response-comment', {
    id: board,
    no: post,
    cpage: page,
  });

  const rawHtml = response.data;

  const $ = cheerio.load(rawHtml);

  const comments: Comment[] = [];
  $('.all-comment-lst .comment, .all-comment-lst .comment-add').each((i, e) => {
    const commentEl = $(e);

    if (commentEl.find('.delted').length > 0) return;

    const author = commentEl.find('.nick').text().trim();
    const content = commentEl.find('.txt').text().trim();
    const date = parseDate(commentEl.find('.date').text().trim()).toISOString();

    // pass empty content(디시콘)
    if (!content) return;

    const comment: Comment = {
      author,
      content,
      date,
      ...postMeta,
    };

    comments.push(comment);
  });

  const pagingEl = $('.paging');
  if (pagingEl.length === 0) {
    return {
      data: comments,
      hasNext: false,
    };
  } else {
    const hasNext = pagingEl.find(`option[value="${page + 1}"]`).length > 0;
    return {
      data: comments,
      hasNext,
    };
  }
}

export async function getComments(board: string, post: string, postMeta: { postDate: string; postLink: string; postTitle: string }) {
  let comments: Comment[] = [];

  let page = 1;

  let next = true;
  console.log(`- crawl comments for '${postMeta.postTitle}'`);
  while (next) {
    console.log('  - comment page: ', page);

    const paginator = await getCommentsPerPage(board, post, page, postMeta);
    comments = comments.concat(paginator.data);
    console.log('    - crawled comments...: ', comments.length);

    if (!paginator.hasNext) {
      next = false;
    } else {
      page++;
      await sleep(100);
    }
  }

  console.log('  - total comments: ', comments.length);

  return comments;
}
