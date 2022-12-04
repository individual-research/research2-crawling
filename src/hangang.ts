import axios from 'axios';
import cheerio from 'cheerio';
import { getComments } from './getComments';
import type { Comment, Post } from './types/comments';
import fs from 'fs';
import { reportError, sleep } from './utils';

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

function makeUrl(keyword: string, target: 'title' | 'title_content' | 'content' | 'comment' | 'nick_name', page: number | string, board: string) {
  return `/search.php?mid=${board}&listStyle=webzine&search_keyword=${encodeURIComponent(keyword)}&search_target=${target}&page=${page}`;
}

export const crawlBestLinks = async (keyword: string, target: 'title' | 'title_content' | 'content' | 'comment' | 'nick_name', start: number, end: number) => {
  const links: { link: string; title: string; author: string; date: string }[] = [];
  for (let page = start; page <= end; page++) {
    const { data } = await http.get(makeUrl(keyword, target, page, 'best'));
    const $ = cheerio.load(data);

    console.log('curPage: ', page);

    //regdate
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

      if (link) links.push({ link, title, date, author });
    });

    await sleep(1000);
  }

  return links;
};

export const crawlComments = async (posts: Post[]) => {
  let comments: Comment[] = [];

  for (const [idx, post] of Object.entries(posts)) {
    console.log(`${idx}/${posts.length}`);

    try {
      const { data } = await http.get(post.link);
      const $ = cheerio.load(data);

      const postTitle = $('.top_area .np_18px_span').text().trim();
      // const postAuthor = $('.gallview-tit-box .ginfo2 li').eq(0).text().trim();
      const postDate = $('.top_area .date').text().trim();

      console.log('title: ', postTitle);

      const regex = /^.*document_srl=([0-9]+).*$/.exec(post.link);
      if (regex) {
        try {
          const curComments = await getComments('best', regex[1], { postTitle, postDate, postLink: `https://www.fmkorea.com${post.link}` });
          fs.writeFileSync(`./comments/${regex[1]}.json`, JSON.stringify(curComments, null, 2));
          comments = comments.concat(curComments);
        } catch (e) {
          reportError(e, `${regex[1]}번 게시글의 댓글을 불러오던 중 오류가 발생했습니다. (${post.link})`);
        }

        // console.log(JSON.stringify(curComments.slice(0, 1), null, 2));
      }
    } catch (e) {
      reportError(e, `"${post.title}" 게시글의 크롤링 도중 오류가 발생했습니다. (${post.link})`);
    }

    await sleep(1000);
  }

  return comments;
};
