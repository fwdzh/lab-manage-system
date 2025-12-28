<template>
  <h2>hello, {{ usrename }}</h2>
</template>

<script setup>
import { ref } from 'vue';
const usrename = ref(localStorage.getItem('username'))

</script>
