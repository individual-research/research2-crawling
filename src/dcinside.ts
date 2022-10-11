import axios from 'axios';
import cheerio from 'cheerio';
import type { Comment } from './types/comments';

/** axios instance for m.dcinside.com */
const http = axios.create({
  baseURL: 'https://m.fmkorea.com/',
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36',
  },
});

const bestBoard = 'dcbest';

export const crawlBestLinks = async () => {
  const maxPage = 30;

  const links: string[] = [];
  for (let page = 1; page <= maxPage; page++) {
    const { data } = await http.get(`/board/${bestBoard}?page=${page}`);
    const $ = cheerio.load(data);

    console.log('curPage: ', page);

    $('.gall-detail-lst > li:not(.adv-inner) a:first-child').each((i, e) => {
      const link = $(e).attr('href');
      if (link) links.push(link);
    });
  }

  return links;
};

export const crawlComments = async (links: string[], maxCount: number) => {
  const comments: Comment[] = [];

  for (const link of links) {
    if (comments.length >= maxCount) break;

    const { data } = await http.get(link);
    const $ = cheerio.load(data);

    const postTitle = $('.gallview-tit-box .tit').text().trim();
    const postAuthor = $('.gallview-tit-box .ginfo2 li').eq(0).text().trim();
    const postDate = $('.gallview-tit-box .ginfo2 li').eq(1).text().trim();

    console.log('title: ', postTitle);

    const commentElements = $('.all-comment-lst .comment, .all-comment-lst .comment-add');

    for (const e of commentElements) {
      if (comments.length >= maxCount) break;

      const commentElement = $(e);

      const content = commentElement.find('.txt').text().trim();
      const date = commentElement.find('.date').text().trim();
      const author = commentElement.find('.nick').text().trim();

      // pass empty content(디시콘)
      if (!content) continue;

      console.log('content: ', content);

      comments.push({
        postTitle: postTitle,
        postDate: postDate,
        postLink: link,
        author: author,
        date: date,
        content: content,
      });
    }
  }

  return comments;
};
