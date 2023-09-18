export interface IQueryArray {
  query: string;
  value: string | number;
}

export interface IYoutubeChannel {
  id: string;
  name: string;
}

export interface IYoutubeVideo {
  kind: string;
  id: { videoId: string };
  snippet: {
    publishedAt: Date;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
}

// Param /search
export interface ISearchResource {
  items: IYoutubeVideo[];
}
