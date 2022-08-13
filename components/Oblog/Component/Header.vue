<template>
  <i-header :color="color" class="_text-align:center">
    <h1>{{ title }}</h1>
    <p>{{ content }}</p>
  </i-header>
</template>

<script setup lang="ts">
const props = defineProps({
  content: String,
})

const code = JSON.parse(props.content)
const title = code.title ? code.title : ""
const content = code.content ? code.content : ""
const color = code.color ? code.color : "light"
</script>
