<template>
  <div class="_margin-y:1" v-if="oblog">
    <template v-if="codeType === 'card'">
      <oblog-component-card :content="token.text" />
    </template>
    <template v-else-if="codeType === 'collapsible'">
      <oblog-component-collapsible :content="token.text" />
    </template>
    <template v-else-if="codeType === 'header'">
      <oblog-component-header :content="token.text" />
    </template>
  </div>
  <template v-else>
    <div v-html="html" />
  </template>
</template>

<script setup lang="ts">
import { marked } from "marked"
import { MarkdownToken } from "type";

const props = defineProps({
  token: Object,
  children: Array,
})
const token = props.token as MarkdownToken
const children = props.children as { name: string; url: string }[]
const oblog = ref(false)
const html = ref("")
const code = ref("")
const codeType = ref("")
if (token.lang.indexOf("oblog:") === 0) {
  oblog.value = true
  codeType.value = token.lang.substring(6)
  code.value = token.text
} else {
  oblog.value = false
  html.value = marked.parser([token])
}
</script>
