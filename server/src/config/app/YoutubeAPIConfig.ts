export const VIDEOS_IN_CACHE_EXPIRATION = 86400; // 1 day

export function lastVideosQueries(
  channelId: string,
  numberOfVideos: number = 12,
) {
  return [
    { query: 'channelId', value: channelId },
    { query: 'part', value: 'snippet' },
    { query: 'order', value: 'date' },
    { query: 'maxResults', value: numberOfVideos },
  ];
}

export const SAULLO_CHANNEL = {
  id: 'UCiz-NHCExb8Q1zmvy0An4ug',
  name: 'Saullo',
};
