<template>
  <h2>Hello 👋 {{ username }}</h2>
  <img src="/maodie.gif">
</template>

<script setup>
  import { ref } from 'vue';
  const username = ref(localStorage.getItem('username'))
</script>
