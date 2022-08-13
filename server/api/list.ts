import { escape } from "querystring";
import { api } from "../uitl";

interface ArticelItem {
  id: string;
  name: string;
  lastModifiedDateTime: string;
  "@microsoft.graph.downloadUrl"?: string;
  folder?: {
    childCount: number;
  };
}

export default defineEventHandler(async (_event) => {
  let errorMessage = "";
  let dirItems: ArticelItem[] = [];
  let articles: { id: string; name: string; lastModifiedDateTime: string }[] =
    [];

  const config = useRuntimeConfig();
  const pathArray = config.rootPath.split("/");
  let path = config.onedriveUri + "/root:";
  pathArray.forEach((p) => {
    if (p !== "") {
      path += "/" + escape(p);
    }
  });
  path +=
    ":/children?select=id,name,lastModifiedDateTime,@microsoft.graph.downloadUrl,folder";

  await api(path, {
    method: "GET",
    parseResponse: JSON.parse,
  })
    .then(({ value }) => {
      dirItems = value as ArticelItem[];
    })
    .catch((error) => {
      errorMessage = error.message;
    });

  articles = [];
  dirItems.forEach((dirItem) => {
    if (dirItem.folder !== undefined) {
      articles.push({
        id: dirItem.id,
        name: dirItem.name,
        lastModifiedDateTime: dirItem.lastModifiedDateTime,
      });
    }
  });

  return {
    articles,
    error: errorMessage,
  };
});
