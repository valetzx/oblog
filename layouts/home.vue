<template>
  <div>
    <div class="xs:h-2 sm:h-3 md:h-4 lg:h-5 xl:h-6"></div>
    <i-container>
      <i-layout>
        <i-layout-header>
          <i-navbar :collapse="false">
            <i-navbar-brand>
              <h4 class="_color:primary-60 _cursor:pointer" @click="backHome">{{ blogName }}</h4>
            </i-navbar-brand>
            <span class="lead _color:primary-50">
              {{ headMessage }}
            </span>
          </i-navbar>
        </i-layout-header>
        <i-layout-content>
          <nuxt-page />
        </i-layout-content>
      </i-layout>
    </i-container>
    <div class="xs:h-2 sm:h-3 md:h-4 lg:h-5 xl:h-6"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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

definePageMeta({
  title: "OneDrive/Blog"
})

export default defineComponent({
  name: "home",
  setup() {
    const blogName = useState("blogName", () => "OneDrive/Blog");
    const headMessage = useState("headMessage", () => "");
    useState("articleInfo", () => ({
      needPassword: false,
      name: "",
      type: "",
      url: ""
    }))
    useState<string>("password", () => "")
    return {
      blogName,
      headMessage,
    }
  },
  mounted() {
    const route = useRoute()
    if (route.path.indexOf("/article") === 0) {
      this.fetchSettings()
    }
  },
  methods: {
    fetchSettings() {
      $fetch<{ settings: SettingData; error: string }>(
        "/api/settings",
        {
          parseResponse: JSON.parse
        }).then((data) => {
          if (data.settings.saying !== undefined && data.settings.saying !== "") {
            useState("headMessage").value = data.settings.saying
          }
          if (data.settings.heading !== undefined && data.settings.heading !== "") {
            useState("blogName").value = data.settings.heading
          }
        })
    },
    backHome() {
      const router = useRouter()
      router.push("/")
    }
  }
});
</script>
