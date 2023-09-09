import axios, { AxiosResponse } from 'axios';

import {
  IQueryArray,
  ISearchResource,
  IYoutubeChannel,
} from '../config/interfaces/IYoutube';
import { CREDENTIALS } from '../config/constants';
import RedisService from './RedisService';
import {
  SAULLO_CHANNEL,
  lastVideosQueries,
  VIDEOS_IN_CACHE_EXPIRATION,
} from '../config/app/YoutubeAPIConfig';
import getRedisKeyHelper from '../helpers/redisHelper';

class YoutubeAPIService {
  private apiKey = CREDENTIALS.GOOGLE_API_KEY;
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

  getYTBDocumentMock(): any {
    /* const res = {
      kind: 'youtube#searchListResponse',
      etag: 'iwCphrtKI-N93c43ZAHlEp_sp5I',
      nextPageToken: 'CAwQAA',
      regionCode: 'BR',
      pageInfo: { totalResults: 2132, resultsPerPage: 12 },
      items: [
        {
          kind: 'youtube#searchResult',
          etag: 'BJ6ysFTu5kUhVJ18j2fJIgXpi1E',
          id: { kind: 'youtube#video', videoId: 'dY1UGcHOOW8' },
          snippet: {
            publishedAt: '2023-08-31T21:25:00Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title:
              'Vendi uma AWP GUNGNIR para fazer essa LOUCURA ( Batalha de R$17.000,00 no CSGONET )',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/dY1UGcHOOW8/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/dY1UGcHOOW8/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/dY1UGcHOOW8/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-31T21:25:00Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'q2tuXq-XPMkg0l7IjBDAAqoX5Ck',
          id: { kind: 'youtube#video', videoId: '44nRYHZD_6g' },
          snippet: {
            publishedAt: '2023-08-31T15:33:00Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title:
              'Ganhei 15 LUVAS na CAIXA de $1.46 no CSGONET 😱 ( mais de R$50.000,00 )',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/44nRYHZD_6g/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/44nRYHZD_6g/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/44nRYHZD_6g/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-31T15:33:00Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'ys8cM0b6M33sShi8ZH9W9br5oxg',
          id: { kind: 'youtube#video', videoId: 'Eeybem8P3XY' },
          snippet: {
            publishedAt: '2023-08-30T21:32:00Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title: 'INSANO: Ganhei uma AWP MEDUSA com $30 no CSGONET 🤑🤑',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/Eeybem8P3XY/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/Eeybem8P3XY/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/Eeybem8P3XY/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-30T21:32:00Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'Y9LHLdNom6C-BAvnUJyb8gigWSY',
          id: { kind: 'youtube#video', videoId: 'fZY7dBumr6k' },
          snippet: {
            publishedAt: '2023-08-30T15:23:00Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title: 'Abri 50 CAIXAS na VALVE e ganhei uma SUPER FACA no CSGO',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/fZY7dBumr6k/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/fZY7dBumr6k/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/fZY7dBumr6k/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-30T15:23:00Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: '3DRWD1yadxPeaP6Z4fpQrpyBlKY',
          id: { kind: 'youtube#video', videoId: '3H_OYPNU-Hk' },
          snippet: {
            publishedAt: '2023-08-29T21:20:00Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title:
              'Depositei $50 na conta de um INSCRITO e veio FACA + LUVA + 8 SKINS no CSGO',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/3H_OYPNU-Hk/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/3H_OYPNU-Hk/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/3H_OYPNU-Hk/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-29T21:20:00Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'u3L7vhyktxQzY9Sh1xdRyPehpMU',
          id: { kind: 'youtube#video', videoId: 'Hz0EF7K-SBc' },
          snippet: {
            publishedAt: '2023-08-29T15:30:05Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title:
              'Ele tinha APENAS $3 de saldo e o SONHO de ter sua PRIMEIRA FACA no CSGO 😱',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/Hz0EF7K-SBc/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/Hz0EF7K-SBc/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/Hz0EF7K-SBc/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-29T15:30:05Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: '6k6r1SBfnRMaQxSFXudCFC5u030',
          id: { kind: 'youtube#video', videoId: 'SwlfX298drk' },
          snippet: {
            publishedAt: '2023-08-28T21:00:15Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title:
              'as CAIXAS GRÁTIS viraram uma LUVA para o INSCRITO no CSGONET',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/SwlfX298drk/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/SwlfX298drk/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/SwlfX298drk/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-28T21:00:15Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'Kickd9KpV9agqVdGKMtlhPQV9k0',
          id: { kind: 'youtube#video', videoId: '3-1Rk1ZAR-Q' },
          snippet: {
            publishedAt: '2023-08-28T15:26:00Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title:
              'o INSCRITO trocou uma P250 por uma FACA Crimson Web no CSGONET 😱🤑',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/3-1Rk1ZAR-Q/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/3-1Rk1ZAR-Q/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/3-1Rk1ZAR-Q/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-28T15:26:00Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'iH4O_zawvszZK5RSbEHQG72AThk',
          id: { kind: 'youtube#video', videoId: '8xN-uW1fL98' },
          snippet: {
            publishedAt: '2023-08-27T21:10:00Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title:
              'Ganhei uma FACA RARA com DIAMANTE no PLAYSIDE no CSGONET 🤑',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/8xN-uW1fL98/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/8xN-uW1fL98/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/8xN-uW1fL98/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-27T21:10:00Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: '3Cy5BE1bk36a66X1g-zc6vM5WRQ',
          id: { kind: 'youtube#video', videoId: 'oDieMEd5SYk' },
          snippet: {
            publishedAt: '2023-08-27T16:06:36Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title:
              'Abri a nova CAIXA de R$600,00 na conta do INSCRITO no CSGONET',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/oDieMEd5SYk/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/oDieMEd5SYk/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/oDieMEd5SYk/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-27T16:06:36Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: '1C4GDke9aZJdnYwcfWeswoqOIqA',
          id: { kind: 'youtube#video', videoId: 'hw9ccKP8cKU' },
          snippet: {
            publishedAt: '2023-08-26T21:00:16Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title:
              'Ganhei uma LUVA &quot; MAX RED &quot; de R$20.000,00 no CSGO 😱😱😱',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/hw9ccKP8cKU/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/hw9ccKP8cKU/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/hw9ccKP8cKU/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-26T21:00:16Z',
          },
        },
        {
          kind: 'youtube#searchResult',
          etag: 'SWyf187Ys23Jfs8JrS-DH3_7JtM',
          id: { kind: 'youtube#video', videoId: 'MTa5Trc0mZ8' },
          snippet: {
            publishedAt: '2023-08-25T21:30:02Z',
            channelId: 'UCiz-NHCExb8Q1zmvy0An4ug',
            title:
              'ABSURDO: Na última CAIXA veio uma FACA para o INSCRITO no CSGONET 😱',
            description:
              'CSGO.Net: https://csgo.net/utm/saullo | Cupom: SONHO ☆ ▻Extensão PROFIT HELPER: ...',
            thumbnails: {
              default: {
                url: 'https://i.ytimg.com/vi/MTa5Trc0mZ8/default.jpg',
                width: 120,
                height: 90,
              },
              medium: {
                url: 'https://i.ytimg.com/vi/MTa5Trc0mZ8/mqdefault.jpg',
                width: 320,
                height: 180,
              },
              high: {
                url: 'https://i.ytimg.com/vi/MTa5Trc0mZ8/hqdefault.jpg',
                width: 480,
                height: 360,
              },
            },
            channelTitle: 'Canal do Saullo',
            liveBroadcastContent: 'none',
            publishTime: '2023-08-25T21:30:02Z',
          },
        },
      ],
    }; */
    const res = { kind: 'iudahnwd', items: { awd: 'dawd' } };
    return res;
  }

  async getLastVideos(): Promise<ISearchResource | undefined> {
    const redisKey = getRedisKeyHelper('ytb_last_videos', this.channelName);
    const videosInCache: any = await RedisService.get(redisKey, {
      inJSON: true,
    });

    if (!videosInCache) {
      const videosFromAPI = (
        await this.getYTBDocument('search', lastVideosQueries(this.channelId))
      ).data;

      await RedisService.set(
        redisKey,
        videosFromAPI,
        { inJSON: true },
        VIDEOS_IN_CACHE_EXPIRATION,
      );
      return videosFromAPI;
    }
    return videosInCache;
  }
}

export default new YoutubeAPIService(SAULLO_CHANNEL);
