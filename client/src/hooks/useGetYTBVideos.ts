import { useState, useEffect, useRef } from 'react';

import { IYoutubeSearchResource } from '../config/interfaces/IYoutube';
import AxiosService from '../services/AxiosService';
import IAPIResponse from '../config/interfaces/IAPIResponse';
import URLS from '../config/constants/URLS';

export default function useGetVideos() {
  const initialCallCompleted = useRef(false);
  const [data, setData] = useState<IYoutubeSearchResource | null>(null);

  const fetchData = async () => {
    const response = await AxiosService.get<IAPIResponse<IYoutubeSearchResource>>(
      URLS.ENDPOINTS.EXTERNAL_APIS.youtube,
    );
    response && setData(response.data.data);
  };

  useEffect(() => {
    if (!initialCallCompleted.current) {
      initialCallCompleted.current = true;
      fetchData();
    }
  }, []);

  return data;
}
