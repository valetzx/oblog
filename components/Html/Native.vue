<template>
  <iframe class="w-full" style="height: calc(100vh - 8.5rem)" :srcdoc="result"></iframe>
</template>

<script setup lang="ts">

const props = defineProps({
  html: String,
  children: Array,
});

const result = ref(props.html)
const children = props.children as { name: string; url: string }[]

onMounted(() => {
  children.forEach((c) => {
    result.value = result.value.replaceAll(`src="${c.name}"`, `src="${c.url}"`)
    result.value = result.value.replaceAll(`src="./${c.name}"`, `src="${c.url}"`)
    result.value = result.value.replaceAll(`href="${c.name}"`, `href="${c.url}"`)
    result.value = result.value.replaceAll(`href="./${c.name}"`, `href="${c.url}"`)
  })
  console.log(result)
})
</script>
