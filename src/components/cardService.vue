<template>
  <div>
    <h3>{{ service?.name || service?.item.name }}</h3>
    <p v-if="myServices">{{ service.price }}€</p>
  </div>
</template>

<script setup>
import {defineProps} from 'vue'

defineProps({
  service: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      type: '',
      price: [],
    }),
  },
  myServices: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>

<style scoped>
div {
  position: relative;
  max-width: 200px;
  min-width: 200px;
  border: 1px solid black;
  padding: 10px;
  border-radius: 10px;
}

div:hover {
  transform: scale(1.05);
  transition: transform 0.3s;
  opacity: 0.8;
  cursor: pointer;
}

h3, p {
  margin: 0;
}

@media (max-width: 600px) {
  div {
    width: auto;
    max-width: unset;
    min-width: unset;
    flex-direction: column;
    align-items: flex-start;
  }

  h3 {
    font-size: 1em;
  }
}
</style>