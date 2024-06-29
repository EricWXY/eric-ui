<script setup lang="ts">
import { ja, ko, en, zhCn, zhTw, ErConfigProvider } from "eric-ui";
import { get } from "lodash-es";

import { computed, ref } from "vue";

const language = ref("");
const langMap = {
  ja,
  ko,
  en,
  zhCn,
  zhTw,
} as const;
const locale = computed(() => get(langMap, language.value));
const changelang = () => {
  const l = ["zhCn", "zhTw", "ko", "en", "ja"];
  language.value = l[(l.indexOf(language.value) + 1) % l.length];
};
</script>
<template>
  <er-button @click="changelang" type="info" style="margin-right: 20px"
    >change language</er-button
  >
  <er-config-provider :locale="locale">
    <er-popconfirm title="Are you shure to delete this item?">
      <er-button>Delete</er-button>
    </er-popconfirm>
  </er-config-provider>
</template>
