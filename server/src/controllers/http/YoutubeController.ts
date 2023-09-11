import { NextFunction, Request, Response } from 'express';

import YoutubeAPIService from '../../services/YoutubeAPIService';
import { responseBody } from '../../helpers/responseHelpers';

class YoutubeController {
  async getLastVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const ytbRes = await YoutubeAPIService.getLastVideos();
      return res.status(200).json(responseBody(true, 'GET_MSG', ytbRes));
    } catch (err) {
      return next(err);
    }
  }
}

export default new YoutubeController();
