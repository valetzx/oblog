<template>
  <div v-html="html" />
</template>

<script setup lang="ts">
import { marked } from "marked"

const props = defineProps({
  token: Object,
  children: Array,
})
const token = props.token
const children = props.children as { name: string; url: string }[]
const html = ref(marked.parser([token]))

children.forEach((c) => {
  html.value = html.value.replaceAll(`src="${c.name}"`, `src="${c.url}"`)
  html.value = html.value.replaceAll(`src="./${c.name}"`, `src="${c.url}"`)
  html.value = html.value.replaceAll(`href="${c.name}"`, `href="${c.url}"`)
  html.value = html.value.replaceAll(`href="./${c.name}"`, `href="${c.url}"`)
})
</script>
