# O-Blog

> WIP

需要在部署时添加以下环境变量，或者在`nuxt.config.ts`内填写相应变量。

```
NUXT_CLIENT_ID=""
NUXT_CLIENT_SECRET=""
NUXT_REDIRECT_URI="http://localhost:3000/auth"
NUXT_REFRESH_TOKEN=""
NUXT_ROOT_PATH="/Blog"
```

文件夹命名格式由原来的`1-文章名`改为`[1][文章名][标签1;标签2][color_danger]`，color直接借用inkline的名称，见[https://www.inkline.io/docs/components/card#color-variants](https://www.inkline.io/docs/components/card#color-variants)。

根目录下的设置文件参考

```json
{
  "desc": false,
  "heading": "arect 的博客",
  "saying": "欢迎访问，项目：arect/o-blog",
  "button": "阅读",
  "pageSize": 10,
  "message": "欢迎访问，但是项目仍在开发中（我好懒"
}
```

可在网址后添加`/auth`来快捷获取refresh token，例如`https://onedrive-blog.vercel.app/auth`