import axios from "axios";
import { Configuration, DefaultApi } from "../../api_client";
import appConfig from "../../app-config";

const ApiClient = (apiToken: string) => {
  const config = new Configuration({
    basePath: appConfig.apiOrigin,
    baseOptions: {
      headers: { Authorization: `Bearer ${apiToken}` },
    },
  });

  return new DefaultApi(
    config,
    "",
    axios.create({
      timeout: 10 * 1000, // 単位: ms, デフォルト: 無限
      withCredentials: true, // cookie送るのに必要
    })
  );
};

export default ApiClient;
