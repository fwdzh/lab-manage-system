<template>
  <h2>Ciallo～(∠・ω&lt; )⌒☆ 👋 {{ usrename }}</h2>
  <img src="/cat.gif">
</template>

<script setup>
import { ref } from 'vue';
const usrename = ref(localStorage.getItem('username'))

</script>
