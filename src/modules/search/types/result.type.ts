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
