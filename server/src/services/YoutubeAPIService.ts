import axios, { AxiosResponse } from 'axios';

import {
  IQueryArray,
  ISearchResource,
  IYoutubeChannel,
} from '../config/interfaces/IYoutube';
import {
  SAULLO_CHANNEL,
  lastVideosQueries,
  VIDEOS_IN_CACHE_EXPIRATION,
} from '../config/app/YoutubeAPIConfig';
import ENVIRONMENT from '../config/constants/ENVIRONMENT';
import getRedisKeyHelper from '../helpers/redisHelper';
import { RedisInstance } from '..';
import { YoutubeAPIError } from '../config/errors/classes/SystemErrors';

class YoutubeAPIService {
  private apiKey = ENVIRONMENT.GOOGLE_API_KEY;
  private baseURL: string = 'https://www.googleapis.com/youtube/v3';
  private channelId: string;
  private channelName: string;

  constructor(channelTarget: IYoutubeChannel) {
    this.channelName = channelTarget.name;
    this.channelId = channelTarget.id;
  }

  async getYTBDocument(
    param: string,
    queries: IQueryArray[],
  ): Promise<AxiosResponse<any, any>> {
    let endPoint = `${this.baseURL}/${param}?key=${this.apiKey}`;
    queries.forEach((query) => (endPoint += `&${query.query}=${query.value}`));
    const res = await axios.get(endPoint);
    return res;
  }

  async getLastVideos(): Promise<ISearchResource | undefined> {
    try {
      const redisKey = getRedisKeyHelper('ytb_last_videos', this.channelName);
      const videosInCache: any = await RedisInstance.get(redisKey, {
        inJSON: true,
      });

      if (!videosInCache) {
        const videosFromAPI = (
          await this.getYTBDocument('search', lastVideosQueries(this.channelId))
        ).data;

        await RedisInstance.set(
          redisKey,
          videosFromAPI,
          { inJSON: true },
          VIDEOS_IN_CACHE_EXPIRATION,
        );
        return videosFromAPI;
      }
      return videosInCache;
    } catch (err: any) {
      throw new YoutubeAPIError(err);
    }
  }
}

export default new YoutubeAPIService(SAULLO_CHANNEL);
