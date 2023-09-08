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
      high: { url: string; width: number; height: number };
    };
  };
}

export interface IYoutubeSearchResource {
  items: IYoutubeVideo[];
}
