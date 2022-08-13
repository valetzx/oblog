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
    <div v-else-if="error !== ''">
      <i-card color="danger" class="_margin-top:1">
        <template #header><strong>出现了错误</strong></template>
        {{ parseError(error) }}
      </i-card>
    </div>
    <div v-else>
      <div v-if="filterTag !== ''" class="_margin-top:1 _display:flex _align-items:center">
        <span class="lead">标签：</span>
        <i-badge>{{ filterTag }}</i-badge>
        <i-icon name="ink-times" size="sm" class="_color:warning cursor-pointer" @click="selectTag('')" />
      </div>
      <div v-for="article in articleShow" :key="article.name">
        <i-card :color="article.setting.color" class="_margin-top:1">
          <template #header>
            <div class="h5">{{ article.name }}</div>
            <div>
              <em>更新时间：{{ article.lastModifiedDateTime }}</em>
            </div>
          </template>
          <div>
            <i-badge v-for="tag in article.tag" :key="tag" class="_margin-right:1 cursor-pointer"
              @click="selectTag(tag)">
              {{ tag }}
            </i-badge>
          </div>
          <div class="_display:flex _justify-content:end">
            <span :class="
              article.setting.color === '' ||
                article.setting.color === 'light' ||
                article.setting.color === 'warning'
                ? '_color:primary-50'
                : '_color:primary-05'
            " class="cursor-pointer" @click="readArticle(article)">
              {{ settings.button }}
            </span>
          </div>
        </i-card>
      </div>
      <div class="_display:flex _justify-content:center _margin-top:1">
        <i-pagination v-model="nowPage" :items-total="articleSorted.length" :items-per-page="settings.pageSize" />
      </div>
    </div>
    <i-modal v-model="dialog">
      <template #header>
        {{ dialogTitle }}
      </template>
      <div class="_display:flex _align-items:center">
        {{ dialogContent }}
      </div>
      <template #footer class="_display:flex _justify-content:end" />
    </i-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"

interface SettingData {
  message?: {
    title?: string;
    content?: string;
  };
  desc?: boolean;
  heading?: string;
  saying?: string;
  button?: string;
  pageSize?: number;
  [key: string]: any;
}

interface ArticleData {
  id: string;
  name: string;
  index: number;
  tag: string[];
  lastModifiedDateTime: string;
  setting: {
    color: string;
  };
  raw: string;
}

definePageMeta({
  layout: "home",
  keepalive: true,
  title: "OneDrive/Blog"
})

const loading = ref(true)

const settings = ref<SettingData>({})
const articleAll = ref<ArticleData[]>([])
const articleShow = ref<ArticleData[]>([])
const articleSorted = ref<ArticleData[]>([])
const articleTemp = ref([])
const error = ref("")

const dialog = ref(false)
const dialogShown = useState("dialogShown", () => false)
const dialogTitle = ref("")
const dialogContent = ref("")

const nowPage = ref(1)

const loadingMessage = ref("获取数据中…")
const filterTag = ref("")

const fetchList = $fetch<{ articles: any[]; error: string }>("/api/list", { parseResponse: JSON.parse })
const fetchSettings = $fetch<{ settings: SettingData; error: string }>("/api/settings", { parseResponse: JSON.parse })

const fetchData = () => {
  loading.value = true
  Promise.all([fetchList, fetchSettings]).then((data) => {
    loadingMessage.value = "解析数据中…"
    settings.value = data[1].settings
    articleTemp.value = data[0].articles
    error.value = data[0].error ? data[0].error : data[1].error

    if (settings.value.saying !== undefined && settings.value.saying !== "") {
      useState("headMessage").value = settings.value.saying
    }
    if (settings.value.heading !== undefined && settings.value.heading !== "") {
      useState("blogName").value = settings.value.heading
    }
    if (
      dialogShown.value === false &&
      settings.value.message !== undefined &&
      settings.value.message.content !== undefined &&
      settings.value.message.content !== ""
    ) {
      dialog.value = true
      dialogShown.value = true
      dialogTitle.value = settings.value.message.title
      dialogContent.value = settings.value.message.content
    }
  }).then(() => {
    parseArticle()
    sortArticle()
    splitArticle()
    loading.value = false
    loadingMessage.value = "获取数据中…"
  })
}

const parseError = (error: string): string => {
  switch (error) {
    case "Unexpected end of JSON input":
      return "Json 文件不规范"
    case "body used already for: https://login.microsoftonline.com/common/oauth2/v2.0/token":
      return "body used already for: https://login.microsoftonline.com/common/oauth2/v2.0/token"
    default:
      return error
  }
}

const parseArticle = () => {
  articleAll.value = []
  articleTemp.value.forEach(
    (article: { id: string; name: string; lastModifiedDateTime: string }) => {
      const articleFormated: ArticleData = {
        id: article.id,
        name: "",
        index: 0,
        lastModifiedDateTime: "",
        tag: [],
        setting: {
          color: "",
        },
        raw: article.name,
      }

      const macther = RegExp(/\[(.*?)\]/, "g")

      const tempIndex = macther.exec(article.name)
      const tempName = macther.exec(article.name)
      const tempTag = macther.exec(article.name)
      const tempConfig = macther.exec(article.name)

      if (tempIndex === null || tempName === null) {
        return
      }

      if (tempIndex !== null) {
        articleFormated.index = Number(tempIndex[1])
      }
      if (tempName !== null) {
        articleFormated.name = tempName[1]
      }
      articleFormated.lastModifiedDateTime =
        article.lastModifiedDateTime.substring(0, 10)
      if (tempTag !== null) {
        if (tempTag[1] !== "") {
          articleFormated.tag = tempTag[1].split(";")
        }
      }
      if (tempConfig !== null) {
        articleFormated.setting = {
          color: "",
        }
        const tempConfigArray = tempConfig[1].split(";")
        tempConfigArray.forEach((tca) => {
          const tcaFormated = tca.split("_")
          switch (tcaFormated[0]) {
            case "color":
              articleFormated.setting.color = tcaFormated[1]
            default:
              break
          }
        })
      }
      articleAll.value.push(articleFormated)
    }
  )
}

const selectTag = (tag: string) => {
  const router = useRouter()
  const query = tag === "" ? {} : { tag }
  router.push({ query }).then(() => {
    sortArticle()
    splitArticle()
  })
}

const sortArticle = () => {
  const route = useRoute()
  if (route.query.tag !== undefined && route.query.tag !== null && route.query.tag !== "") {
    filterTag.value = `${route.query.tag}`
    articleSorted.value = articleAll.value.filter((a) => a.tag.includes(route.query.tag as string))
    nowPage.value = 1
  } else {
    articleSorted.value = articleAll.value
    filterTag.value = ""
  }

  if (settings.value.desc) {
    articleSorted.value.sort((a, b) => {
      return b.index - a.index
    })
  } else {
    articleSorted.value.sort((a, b) => {
      return a.index - b.index
    })
  }
}

const splitArticle = () => {
  settings.value.pageSize = settings.value.pageSize > 0 ? settings.value.pageSize : 10
  articleShow.value = []
  for (
    let i = 0;
    i + (nowPage.value - 1) * settings.value.pageSize < articleSorted.value.length && i < settings.value.pageSize;
    i++
  ) {
    articleShow.value.push(
      articleSorted.value[i + (nowPage.value - 1) * settings.value.pageSize]
    )
  }
}

const readArticle = (a: ArticleData) => {
  useRouter().push(`/article/${a.id}`)
}

watch(nowPage, () => splitArticle())

onMounted(() => {
  fetchData()
})
</script>
