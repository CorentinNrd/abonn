<template>
  <div class="modal-backdrop">
    <div class="modal">
      <section class="modal-header">
        <button class="btn-close" @click="closeModal">x</button>
      </section>
      <section class="modal-body">
        <h3>{{ service.name || service.item?.name }}</h3>
        <ul v-if="service?.type !== 'autre' && service.item?.type !== 'autre'">
          <li v-for="(price, index) in service.prices || service.item?.prices" :key="index" @click="select(price)">
            <span>{{ price?.price }} €</span>
          </li>
        </ul>
        <div class="add-price-section" v-else>
          <input type="text" placeholder="40€" v-model="priceToAdd.price"/>
          <button class="btn bg-green" :disabled="!priceToAdd.price" @click="addTo">OK</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {defineEmits, defineProps, ref, onMounted} from 'vue';

const props = defineProps({
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
});

const emit = defineEmits(['close', 'select', 'add']);

const priceToAdd = ref({
  item: {
    id: null,
    name: null,
    type: null,
  },
  price: null,
});

const closeModal = () => {
  priceToAdd.value = {
    item: {
      id: null,
      name: null,
      type: null,
    },
    price: null,
  };
  emit('close');
};

const select = (price) => {
  const selectedPrice = {
    item: props.service?.item || props.service,
    price: price.price,
  };
  emit('select', selectedPrice);
}

const addTo = () => {
  emit('add', priceToAdd.value);
}

onMounted(() => {
  if (props.service?.type === 'autre' || props.service.item?.type === 'autre') {
    priceToAdd.value = {
      item: {
        id: props.service?.id || props.service.item?.id,
        name: props.service?.name || props.service.item?.name,
        type: props.service?.type || props.service.item?.type,
      },
      price: props.service?.price || props.service.item?.price || null,
    };
  }
});
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
  border: 1px solid #aeaeae;
  color: #000;
  border-radius: 5px;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.3s;
  display: flex;
  justify-content: space-between;
}

li:hover {
  background-color: #aeaeae;
}

.add-price-section {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>