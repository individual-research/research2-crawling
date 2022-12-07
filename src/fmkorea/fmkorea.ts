import axios from 'axios';
import cheerio from 'cheerio';
import { getComments } from './getComments';
import type { Comment, Post } from '../types';
import fs from 'fs';
import { sleep, parseDate, reportError } from '../utils';

/** axios instance for fmkorea */
const http = axios.create({
  baseURL: 'https://m.fmkorea.com',
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36',
  },
});

function makeUrl(page: number | string, board = 'best') {
  return `https://m.fmkorea.com/index.php?mid=${board}&page=${page}`;
}

export const crawlBestLinks = async (start: number, end: number) => {
  const links: Post[] = [];
  for (let page = start; page <= end; page++) {
    const { data } = await http.get(makeUrl(page));
    const $ = cheerio.load(data);

    console.log('curPage: ', page);

    $('.li_best2_pop0').each((i, e) => {
      const link = $(e).find('a.read_more').attr('href');
      const title = $(e).find('a.read_more').text().trim();
      const date = $(e).find('.regdate').text().trim();
      let author = $(e).find('.author').text().trim();
      // extract author
      const res = /\/ (.*)/.exec(author);
      if (res) {
        author = res[1];
      }

      if (link)
        links.push({
          link,
          title,
          date: parseDate(date).format('YYYY-MM-DD HH-mm-ss'),
          // date: parseDate(date).toISOString(),
          author,
        });
    });

    await sleep(250);
  }

  return links;
};

export const crawlComments = async (posts: Post[], savePath: string) => {
  // let comments: Comment[] = [];

  for (const [idx, post] of Object.entries(posts)) {
    console.log(`${idx}/${posts.length}`);

    try {
      const { data } = await http.get(post.link);
      const $ = cheerio.load(data);

      const postTitle = $('.top_area .np_18px_span').text().trim();
      // const postAuthor = $('.gallview-tit-box .ginfo2 li').eq(0).text().trim();
      const postDate = parseDate($('.top_area .date').text().trim()).toISOString();

      console.log('title: ', postTitle);

      const regex = /\/(.+)\/([0-9]+)/.exec(post.link);
      if (regex) {
        try {
          const curComments = await getComments(regex[1], regex[2], { postTitle, postDate, postLink: `https://www.fmkorea.com${post.link}` });
          fs.writeFileSync(`${savePath}/${regex[2]}.json`, JSON.stringify(curComments, null, 2));
          // comments = comments.concat(curComments);
        } catch (e) {
          reportError(e, `${regex[2]}번 게시글의 댓글을 불러오던 중 오류가 발생했습니다. (${post.link})`);
        }
      }
    } catch (e) {
      reportError(e, `"${post.title}" 게시글의 크롤링 도중 오류가 발생했습니다. (${post.link})`);
    }

    await sleep(250);
  }

  // return comments;
};
