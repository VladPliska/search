export type GoogleSearchResult = {
  title: string;
  link: string;
  displayLink: string;
  htmlTitle: string;
  pagemap: PageMap;
};

export type PageMap = {
  cse_image?: [{ src: string }];
  metatags?: [
    {
      'og:image': string;
    },
  ];
};

export type SearchItem = {
  link: string;
  title: string;
  htmlTitle: string;
  image?: string;
};
