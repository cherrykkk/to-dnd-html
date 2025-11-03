<template>
  <div v-html="monsterCardHtml"></div>
</template>
<script lang="ts" setup>
const props = defineProps<{ monsterCardHtml: string }>();
</script>
