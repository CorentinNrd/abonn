<template>
  <div class="modal-backdrop">
    <div class="modal">
      <section class="modal-header">
        <button class="btn-close" @click="closeModal">x</button>
      </section>
      <section class="modal-body">
        <input class="mb-5" type="tel" placeholder="Ex: Navigo" v-model="service.item.name"/>
        <input type="text" placeholder="40€" v-model="service.price"/>
      </section>
      <button class="btn_no-radius-top bg-green" :disabled="!service.item.name || !service.price" @click="addTo">OK</button>
    </div>
  </div>
</template>

<script setup>
import {defineEmits, ref, watch} from 'vue';

const emit = defineEmits(['close', 'add']);

const service = ref({
  item: {
    id: null,
    name: null,
    type: null,
  },
  price: null,
})

const closeModal = () => {
  emit('close');
};

const addTo = () => {
  emit('add', service.value);
}

watch(
    () => service.value.item.name,
    () => {
      service.value.item.type = 'autre';
      service.value.item.id = service.value.item.name;
    },
)
</script>

<style scoped>
.modal-backdrop {
  z-index: 20;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #F7B538;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  position: relative;
}

.modal-header {
  position: absolute;
  top: 0;
  right: 5px;
  z-index: 4;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
  padding: 5px;
  border: 1px solid #000;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  background-color: #242424;
  transition: background-color 0.3s;
  display: flex;
  justify-content: space-between;
}

li:hover {
  background-color: #575757;
}
</style>