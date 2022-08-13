<template>
  <div>
    <div class="xs:h-2 sm:h-3 md:h-4 lg:h-5 xl:h-6"></div>
    <i-container>
      <i-layout>
        <i-layout-header>
          <i-navbar :collapse="false">
            <i-navbar-brand>
              <h4 class="_color:primary-60">{{ '获取 refresh token' }}</h4>
            </i-navbar-brand>
          </i-navbar>
        </i-layout-header>
        <i-layout-content>
          <i-card class="_margin-top:1" :color="step === 1 ? 'primary' : 'light'">
            <template #header>
              <strong>请输入相关数据</strong>
            </template>
            <template #default>
              <div class="_margin-top:1/2">
                <i-input v-model="client_id" placeholder="请输入Client ID">
                  <template #prefix>
                    <span>客户端ID</span>
                  </template>
                </i-input>
              </div>
              <div class="_margin-top:1/2">
                <i-input v-model="redirect_uri" placeholder="请输入Redirect URI">
                  <template #prefix>
                    <span>跳转链接</span>
                  </template>
                </i-input>
              </div>
              <div class="_margin-top:1/2">
                <i-input v-model="scope" placeholder="请输入Scope">
                  <template #prefix>
                    <span>权&emsp;&emsp;限</span>
                  </template>
                  <template #suffix>
                    <i-tooltip>
                      <em><code>i</code></em>
                      <template #body>权限之间请用空格分隔</template>
                    </i-tooltip>
                  </template>
                </i-input>
              </div>
            </template>
            <template #footer>
              <div class="_display:flex _justify-content:end">
                <i-button :disabled="step !== 1" @click="getCode">下一步</i-button>
              </div>
            </template>
          </i-card>
          <i-card class="_margin-top:1" :color="step === 2 ? 'primary' : 'light'">
            <template #header>
              <strong>请输入相关数据</strong>
            </template>
            <template #default>
              <div class="_margin-top:1/2">
                <i-input v-model="client_secret" type="password" placeholder="请输入Client Secret">
                  <template #prefix>
                    <span>客户端密码</span>
                  </template>
                </i-input>
              </div>
            </template>
            <template #footer>
              <div class="_display:flex _justify-content:end">
                <i-button :disabled="step !== 2" @click="getToken">下一步</i-button>
              </div>
            </template>
          </i-card>
          <div v-if="loading">
            <i-card color="info" class="_margin-top:1">
              <template #header><strong>获取Token中…</strong></template>
              <div class="_display:flex _justify-content:center">
                <i-loader />
              </div>
            </i-card>
          </div>
          <div v-else>
            <i-card v-if="step === 3" class="_margin-top:1" color="primary">
              <template #header>
                <strong>Refresh Token</strong>
              </template>
              <template #default>
                <samp>{{ refresh_token }}</samp>
              </template>
            </i-card>
            <i-card v-if="step === 4" class="_margin-top:1" color="danger">
              <template #header>
                <strong>错误</strong>
              </template>
              <template #default>
                {{ errorMessage }}
              </template>
            </i-card>
          </div>
        </i-layout-content>
      </i-layout>
    </i-container>
    <div class="xs:h-2 sm:h-3 md:h-4 lg:h-5 xl:h-6"></div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'AUTH'
})

const client_id = ref("")
const redirect_uri = ref("")
const scope = ref("Files.Read offline_access")
const client_secret = ref("")

const route = useRoute()
const code = route.query.code as string
const step = ref(1)
if (code !== undefined && code !== "") {
  step.value = 2
}

const loading = ref(false)
const refresh_token = ref("")
const errorMessage = ref("")

const getCode = () => {
  const url = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize")
  url.searchParams.append("client_id", client_id.value)
  url.searchParams.append("scope", scope.value)
  url.searchParams.append("redirect_uri", redirect_uri.value)
  url.searchParams.append("response_type", "code")
  window.location.href = url.toString()
}

const getToken = () => {
  loading.value = true
  $fetch("/api/auth", {
    method: "POST",
    body: {
      client_id: client_id.value,
      redirect_uri: redirect_uri.value,
      client_secret: client_secret.value,
      code: code,
    }
  }).then((data) => {
    errorMessage.value = data.error
    refresh_token.value = data.token
  }).catch((error) => {
    errorMessage.value = error.message
  }).finally(() => {
    if (errorMessage.value === "") {
      step.value = 3
    } else {
      step.value = 4
    }
    loading.value = false
  })
}

onMounted(() => {
  redirect_uri.value = `${window.location.origin}${window.location.pathname}`
})
</script>
