<template>
  <i-collapsible>
    <i-collapsible-item v-for="(c, index) in contents" :key="index" :title="c.title">
      {{ c.content }}
    </i-collapsible-item>
  </i-collapsible>
</template>

<script setup lang="ts">
const props = defineProps({
  content: String,
})

const code = JSON.parse(props.content)
const contents: { title: string; content: string }[] = code.contents ? code.contents : []
</script>
