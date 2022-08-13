<template>
  <div v-html="result" />
</template>

<script setup lang="ts">

const props = defineProps({
  html: String,
  children: Array,
});

const result = ref(props.html)
const children = props.children as { name: string; url: string }[]

children.forEach((c) => {
  result.value = result.value.replaceAll(`src="${c.name}"`, `src="${c.url}"`)
  result.value = result.value.replaceAll(`src="./${c.name}"`, `src="${c.url}"`)
  result.value = result.value.replaceAll(`href="${c.name}"`, `href="${c.url}"`)
  result.value = result.value.replaceAll(`href="./${c.name}"`, `href="${c.url}"`)
})
</script>
