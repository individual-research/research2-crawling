export interface Post {
  link: string;
  title: string;
  date: string;
  author: string;
}

export interface Comment {
  postTitle: string;
  postDate: string;
  postLink: string;
  author: string;
  date: string;
  content: string;
}
