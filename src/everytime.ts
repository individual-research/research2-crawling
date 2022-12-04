import axios from 'axios';
import cheerio from 'cheerio';
import type { Comment } from './types/comments';
import { sleep } from './utils';

/** axios instance for m.dcinside.com */
const http = axios.create({
  baseURL: 'https://m.fmkorea.com',
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36',
  },
});

// const bestBoard = 'best'; // 포텐 최신순
const bestBoard = 'best2'; // 포텐 화제순

export const crawlBestLinks = async (start: number, end: number) => {
  const links: string[] = [];
  for (let page = start; page <= end; page++) {
    const { data } = await http.get(`/board/${bestBoard}?page=${page}`);
    const $ = cheerio.load(data);

    console.log('curPage: ', page);

    $('.li_best2_pop0 > a').each((i, e) => {
      const link = $(e).attr('href');
      if (link) links.push(link);
    });

    await sleep(1000);
  }

  return links;
};

export const crawlComments = async (links: string[], maxCount: number) => {
  const comments: Comment[] = [];

  for (const link of links) {
    if (comments.length >= maxCount) break;

    const { data } = await http.get(link);
    const $ = cheerio.load(data);

    const postTitle = $('.top_area .np_18px_span').text().trim();
    // const postAuthor = $('.gallview-tit-box .ginfo2 li').eq(0).text().trim();
    const postDate = $('.top_area .date').text().trim();

    console.log('title: ', postTitle);

    // fetch comments ajax
    const fetchAllComments = async (documentId: string) => {
      let curPage = 1;
      let maxPage = -1;

      const comments: Comment[] = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const payload = `midforconfig=best2&document_srl=${documentId}&cpage=${curPage}&m=1&tpl_json_encode=1&module=board&act=dispBoardContentCommentList`;
        console.log(payload);

        const response = await axios({
          method: 'post',
          url: 'https://m.fmkorea.com/',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36',
            'Content-Type': 'application/json',
          },
          data: payload,
        });

        console.log(response.status);
        console.log(response.statusText);
        console.log(response.data);
        const $ = cheerio.load(data.tpl);
        const curComments = [...$('.fdb_itm:not(.comment_best)')].map((idx, e) => ({
          postTitle,
          postLink: link,
          postDate,
          author: $(e).find('.meta > a').text().trim(),
          date: '<NO_DATA>',
          content: $(e).find('.xe_content').text().trim(),
        }));
        comments.concat(...curComments);

        maxPage = data.comment_page_navigation.last_page;
        if (curPage >= maxPage) break;
        curPage++;
      }

      return comments;
    };

    const curComments = await fetchAllComments(link.split('/')[2]);
    comments.concat(curComments);

    await sleep(1000);
  }

  return comments;
};
