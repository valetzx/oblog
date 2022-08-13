<template>
  <template v-for="(token, index) in tokens" :key="index">
    <template v-if="token.type === 'code'">
      <oblog-code :token="token" :children="children" />
    </template>
    <template v-else>
      <oblog-single :token="token" :children="children" />
    </template>
  </template>
</template>

<script setup lang="ts">
import { MarkdownToken } from "type"

const props = defineProps({
  tokens: Array,
  children: Array,
});

const tokens: MarkdownToken[] = props.tokens as MarkdownToken[]
</script>
