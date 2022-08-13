<template>
  <i-card :color="color">
    <template #header v-if="header !== ''">
      <strong>{{ header }}</strong>
    </template>
    <template #default>
      {{ content }}
    </template>
    <template #footer v-if="footer !== ''">
      <div v-html="footer" />
    </template>
  </i-card>
</template>

<script setup lang="ts">
const props = defineProps({
  content: String,
})

const code = JSON.parse(props.content)
const header = code.header ? code.header : ""
const content = code.content ? code.content : ""
const footer = code.footer ? code.footer : ""
const color = code.color ? code.color : "light"
</script>
