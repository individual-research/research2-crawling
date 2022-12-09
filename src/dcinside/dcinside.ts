import axios from 'axios';
import cheerio from 'cheerio';
import type { Comment, Post } from '../types';
import { parseDate, reportError, sleep } from '../utils';
import { getComments } from './getComments';
import fs from 'fs';

/** axios instance for m.dcinside.com */
const http = axios.create({
  baseURL: 'https://m.dcinside.com/',
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36',
    Cookie: 'best_cate=B',
  },
});

const bestBoard = 'dcbest';

export const crawlBestLinks = async (start: number, end: number) => {
  const links: Post[] = [];
  for (let page = start; page <= end; page++) {
    const { data } = await http.get(`/board/${bestBoard}?page=${page}`);
    const $ = cheerio.load(data);

    console.log('curPage: ', page);

    $('.gall-detail-lst > li:not(.adv-inner)').each((i, e) => {
      const link = $(e).find('a:first-child').attr('href')!;
      const title = $(e).find('.subjectin').text().trim();
      const author = $(e).find('.ginfo li').eq(0).text().trim();

      links.push({
        link: link.replace(/\?page=[0-9]+$/, ''),
        title: title.replace(/^\[.+\] /, ''),
        date: '<NO_DATA>',
        author,
      });
    });

    await sleep(250);
  }

  return links;
};

export const crawlComments = async (posts: Post[], savePath: string) => {
  // const comments: Comment[] = [];

  for (const [idx, post] of Object.entries(posts)) {
    console.log(`${idx}/${posts.length}`);

    try {
      const { data } = await http.get(post.link);
      const $ = cheerio.load(data);

      const postTitle = $('.gallview-tit-box .tit').text().trim();
      // const postAuthor = $('.gallview-tit-box .ginfo2 li').eq(0).text().trim();
      const postDate = parseDate($('.gallview-tit-box .ginfo2 li').eq(1).text().trim()).toISOString();

      console.log('title: ', postTitle);

      const regex = /\/board\/(.+)\/([0-9]+)/.exec(post.link);
      if (regex) {
        try {
          const curComments = await getComments(regex[1], regex[2], { postTitle, postDate, postLink: post.link });
          fs.writeFileSync(`${savePath}/${regex[2]}.json`, JSON.stringify(curComments, null, 2));
          // comments = comments.concat(curComments);
        } catch (e) {
          reportError(e, `${1}번 게시글의 댓글을 불러오던 중 오류가 발생했습니다. (${post.link})`);
        }
      }
    } catch (e) {
      reportError(e, `"${post.title}" 게시글의 크롤링 도중 오류가 발생했습니다. (${post.link})`);
    }

    await sleep(250);
  }

  // return comments;
};
