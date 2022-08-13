# O-Blog

将OneDrive中的文件夹作为博客，解析文件夹内文章的内容，发送到前端

[演示Demo](https://onedrive-blog.vercel.app)

## 使用

### 1. 获取项目

* 下载仓库源码并导入自己的仓库（此方法可以创建私有仓库）
* Fork本仓库（此方法可以同步后续更新）

需要在部署时添加以下环境变量，或者在`nuxt.config.ts`内填写相应变量。

### 2. 获取Token

打开并登录[https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) ，或者登录Azure，侧栏中点击“`Azure Active Directory`”，再点击侧栏中的“`应用注册`”。点击新注册。

![新注册](./doc/img/new.png)

1. 在名称中填入自己喜欢的名字，只是为了辨认；
2. 受支持的帐户类型中选择：“任何组织目录(任何Azure AD目录-多租户)中的帐户和个人Microsoft帐户(例如，Skype、Xbox)”；
3. 重定向URI中选择“`Web`”，并填入“`http://localhost:3000`”（图中填写的没有“:3000”，就是默认的80端口，比较麻烦。如果后续使用本项目的程序获取refresh_token，可以设置为自定的URI，例如`https://onedrive-blog.vercel.app/auth`）；
4. 点击注册。

![注册应用](./doc/img/register.png)

跳转到应用界面后，复制“应用程序(客户端)ID”。

![复制应用程序ID](./doc/img/clientid.png)

1. 点击侧栏“证书和密码”；
2. 点击“新客户端密码”；
3. 在右侧弹出栏中填写说明和截止期限，截止期限可以随自己心情选择，最长两年；
4. 点击添加。

![新客户端密码](./doc/img/addsecret.png)

添加成功后，复制密钥。**注意：密钥只有第一次添加时才会显示，如果退出页面则无法再次获取。而且，密钥是“*值*”，而不是“*机密ID*”**

![复制密钥](./doc/img/secret.png)

1. 点击“API权限”；
2. 点击“添加权限”；
3. 在右侧弹出栏中选择“`Microsoft Graph`”；
4. 选择“委托的权限”；
5. 勾选“`Files.Read`”和“`offline_access`”；
6. 点击添加权限；
7. 点击“`User.Read`”的更多操作，点击“撤销权限”（默认配置该权限，但是本项目未使用此API，可以撤销）
8. 点击“代表xxx授予管理员同意”

![授权API](./doc/img/selectapi.png)

接下来是最麻烦的获取`refresh_token`。

1. 安装`Node.js`；
2. 控制台执行`npx @beetcb/ms-graph-cli`；
3. 选择“`Global`”，回车；
4. 选择“`OneDrive`”，回车；
5. 按步骤填入值；
6. 跳转到浏览器登录账户，点击接受，如果成功，将可以返回控制台；
7. 控制台会弹出`refresh_token`，保存

![](./doc/img/npm.png)

![](./doc/img/refreshtoken.png)

如果你能肯定成功部署，即可以卸载`Nodejs`。此时，已经获取`client_id`、`client_secret`、`refresh_token`。

*教程中示例的token我都删了，不用试的。*

### 4. 部署至Vercel

在Vercel中新建项目，导入你的仓库，在部署前设置环境

![设置环境截图](./doc/img/vercel_env.png)

填入：

| 环境名             | 值                       |
| :----------------- | :----------------------- |
| NUXT_CLIENT_ID     | 上文获取的client_id      |
| NUXT_CLIENT_SECRET | 上文获取的client_secret  |
| NUXT_REFRESH_TOKEN | 上文获取的refresh_token  |
| NUXT_REDIRECT_URI  | 上文填写的redirect_uri   |
| NUXT_ROOT_PATH     | OneDrive中，文章的根目录 |

点击部署按钮，等待部署完成。部署完成后可以自定义域名，这些就不在讨论范围内了。

### 5. 开始使用

#### 全局设置

在你的OneDrive文件夹内，创建`settings.json`，内容如下：

```json
{
  "desc": false,
  "heading": "arect 的博客",
  "saying": "欢迎访问，项目：arect/o-blog",
  "button": "点击阅读按钮上的字",
  "pageSize": 10,
  "message": {
    "title": "标题",
    "content": "每次打开的弹窗内容"
  }
}
```

#### 编写文章

在博客文件夹内新建文件夹，命名格式为`[index][title][tag1;tag2][color_color]`，例如`[1][文章名][标签1;标签2][color_danger]`。后两个框不是必须的，但是顺序不能改变，例如仅改变颜色时，文件夹名应为`[2][文章名][][color_danger]`，仅添加标签时，文件夹名可为`[3][文章名][标签1;标签2]`，文件夹颜色直接借用inkline的名称，见[https://www.inkline.io/docs/components/card#color-variants](https://www.inkline.io/docs/components/card#color-variants)。

| code            | color        |
| :-------------- | :----------- |
| color_light     | 默认灰色     |
| color_dark      | 默认深色     |
| color_primary   | 蓝色         |
| color_secondary | 紫色         |
| color_success   | 绿色         |
| color_danger    | 红色         |
| color_warning   | 黄色         |
| color_info      | 大概叫青色吧 |

进入文件夹，创建文件`index.html`、`index.md`或`index.txt`，可以编写`html`或是`Markdown`或是纯文本。`Markdown`中如果需要插入图片，可以将图片存在文章文件夹根目录或者一层文件夹内，在`Markdown`中插入`![图片](./name.format)`或者`![图片](./dir/name.format)`。例如：

![markdown内容](./doc/img/markdown_picture2.png)

创建`settings.json`，输入内容如下：

```json
{
  "type": "",
  "password": "123"
}
```

`type`可为`md`、`markdown`、`txt`、`html`以及新增的`oblog`，新增的类型基本使用方法和markdown一样，但是添加了几个组件：

<pre>
<code>
```oblog:card
{
  "header": "卡片头",
  "content": "卡片内容",
  "footer": "卡片脚，支持html，效果自己把握",
  "color": "颜色，例如success或者dark"
}
```

```oblog:collapsible
[
  { "title": "标题", "content": "折叠内容" },
  { "title": "标题", "content": "折叠内容" }
]
```

```oblog:header
{
  "title": "大标题",
  "content": "这是一句话",
  "color": "primary"
}
```
</code>
</pre>

可在网址后添加`/auth`来快捷获取refresh token，例如`https://onedrive-blog.vercel.app/auth`