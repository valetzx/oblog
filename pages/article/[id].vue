<template>
  <div>
    <div v-if="loading">
      <i-card color="info" class="_margin-top:1">
        <template #header><strong>{{ loadingMessage }}</strong></template>
        <div class="_display:flex _justify-content:center">
          <i-loader />
        </div>
      </i-card>
    </div>
    <div v-else-if="articleInfo.needPassword">
      <i-card color="secondary" class="_margin-top:1">
        <template #header><strong>需要密码</strong></template>
        <i-input v-model="password" type="password" placeholder="在此处输入密码" />
        <template #footer>
          <div class="_display:flex _justify-content:end">
            <span class="_color:primary-05 cursor-pointer" @click="fetchArticle">
              确认
            </span>
          </div>
        </template>
      </i-card>
    </div>
    <div v-else-if="error !== ''">
      <i-card color="danger" class="_margin-top:1">
        <template #header><strong>出现了错误</strong></template>
        {{ parseError(error) }}
        <template v-if="error === 'no raw'" #footer>
          <div class="_display:flex _justify-content:end">
            <a class="_color:primary-05 cursor-pointer" href="/">
              返回主页
            </a>
          </div>
        </template>
      </i-card>
    </div>
    <div v-else>
      <div class="_margin-y:1">
        <my-article :raw="articleContent" :type="articleInfo.type" :children="articleInfo.children" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios"
import MyArticle from "~~/components/MyArticle.vue";

interface ResultData {
  needPassword?: boolean;
  type: string;
  url: string;
  name: string;
  children?: { name: string; url: string }[],
  [key: string]: any;
}

definePageMeta({
  layout: "home",
  title: "OneDrive/Blog"
})

const articleId = ref(useRoute().params.id)
const loading = ref(true)
const password = useState<string>("password", () => "")
const loadingMessage = ref("获取文章信息中…")
const error = ref("")
const articleInfo = ref<ResultData>({
  type: "text",
  url: "",
  name: "",
})

const articleContent = ref("")

const fetchArticle = () => {
  loading.value = true;
  $fetch<{ result: ResultData; error, string }>("/api/article", {
    method: "POST",
    body: { id: articleId.value, password: password.value },
    parseResponse: JSON.parse
  }).then((data) => {
    if (data.error) {
      error.value = data.error
    }
    articleInfo.value = data.result
  }).then(() => {
    if (articleInfo.value.needPassword) {
      return
    }
    loadingMessage.value = "下载文章中…"
    if (!articleInfo.value.url || articleInfo.value.url === "") {
      error.value = "no index file"
      return
    }
    return axios.get(articleInfo.value.url).then(({ data }) => {
      articleContent.value = data
    })
  }).catch((err) => {
    error.value = err.message
  }).finally(() => {
    loading.value = false
  })
}

const parseError = (error: string): string => {
  switch (error) {
    case "Unexpected end of JSON input":
      return "Json 文件不规范"
    case "body used already for: https://login.microsoftonline.com/common/oauth2/v2.0/token":
      return "body used already for: https://login.microsoftonline.com/common/oauth2/v2.0/token"
    case "no index file":
      return "没有找到文章正文，请等待同步"
    case "no raw":
      return "缺少文章信息，请回到主页重新访问"
    case "Invalid URL ()":
      return "获取信息失败"
    default:
      return error
  }
}

onMounted(() => {
  fetchArticle()
})
</script>