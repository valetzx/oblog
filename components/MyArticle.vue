<template>
  <div class="markdown-body">
    <template v-if="type === 'oblog'">
      <oblog-container :tokens="result" :children="children" />
    </template>
    <template v-else-if="type === 'markdown' || type === 'md'">
      <markdown-native :html="result" :children="children" />
    </template>
    <template v-else-if="type === 'html'">
      <html-native :html="raw" :children="children" />
    </template>
    <template v-else-if="type === 'txt' || type === 'text'">
      <div style="white-space: pre-wrap">
        {{ raw }}
      </div>
    </template>
    <template v-else>
      <div style="white-space: pre-wrap">
        {{ raw }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { marked } from "marked"

const props = defineProps({
  type: String,
  raw: String,
  children: Array,
})

let result: any = ""
if (props.type === "markdown" || props.type === "md") {
  result = marked.parse(props.raw)
} else if (props.type === "oblog") {
  result = marked.lexer(props.raw)
}
</script>

<style src="assets/css/github-markdown.css">
</style>

<style scoped>
.markdown-body {
  box-sizing: border-box;
  margin: 0 auto;
}
</style>
