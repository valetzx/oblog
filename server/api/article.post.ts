import { api } from "../uitl";

interface ResultData {
  name: string;
  password?: string;
  type: string;
  url: string;
  children: {
    name: string;
    url: string;
  }[];
  [key: string]: any;
}

export default defineEventHandler(async (event) => {
  const result: ResultData = {
    name: "",
    type: "",
    url: "",
    children: [],
  };

  const params = await useBody(event);
  const articleId = params.id;
  const password = params.password ? params.password : "";
  let errorMessage = "";

  const config = useRuntimeConfig();
  const path = `${config.onedriveUri}/items/${articleId}?expand=children(select=id,name,@microsoft.graph.downloadUrl)`;

  const directorys: { name: string; id: string }[] = [];
  let settingUrl = "";
  let needChildren = true;

  await api(path, { method: "GET", parseResponse: JSON.parse })
    .then(({ name, children }) => {
      result.name = name;
      children.forEach((n) => {
        if (n.name.indexOf("index.") === 0) {
          result.url = n["@microsoft.graph.downloadUrl"];
          result.type = n.name.substring(6);
        } else if (n.name.indexOf("settings.json") === 0) {
          settingUrl = n["@microsoft.graph.downloadUrl"];
        } else if (n["@microsoft.graph.downloadUrl"]) {
          result.children.push({
            name: n.name,
            url: n["@microsoft.graph.downloadUrl"],
          });
        } else {
          directorys.push({
            name: n.name,
            id: n.id,
          });
        }
      });
    })
    .catch((error) => {
      errorMessage = error.message;
    });
  if (errorMessage !== "") {
    return {
      result,
      error: errorMessage,
    };
  }

  if (settingUrl !== "") {
    await api(settingUrl, { method: "GET", parseResponse: JSON.parse })
      .then((data) => {
        if (data && data.type) {
          result.type = data.type;
        }
        if (data && data.password) {
          if (password !== data.password) {
            result.url = "";
            needChildren = false;
            if (result.children) {
              delete result.children;
            }
            result["needPassword"] = true;
          }
        }
        if (
          result.type !== "markdown" &&
          result.type !== "md" &&
          result.type !== "html" &&
          result.type !== "oblog"
        ) {
          needChildren = false;
          if (result.children) {
            delete result.children;
          }
        }
      })
      .catch((error) => {
        errorMessage = error.message;
      });
  }

  if (needChildren) {
    const directoryApis = [];
    directorys.forEach((d) => {
      directoryApis.push(
        api(
          `${config.onedriveUri}/items/${d.id}/children?select=name,@microsoft.graph.downloadUrl`,
          { method: "GET", parseResponse: JSON.parse }
        )
      );
    });

    await Promise.all(directoryApis).then(
      (
        data: {
          value: { name: string; "@microsoft.graph.downloadUrl": string }[];
        }[]
      ) => {
        for (let i = 0; i < data.length && i < directorys.length; i++) {
          data[i].value.forEach((v) => {
            if (v["@microsoft.graph.downloadUrl"]) {
              result.children.push({
                name: `${directorys[i].name}/${v.name}`,
                url: v["@microsoft.graph.downloadUrl"],
              });
            }
          });
        }
      }
    );
  }

  return {
    result,
    error: errorMessage,
  };
});
