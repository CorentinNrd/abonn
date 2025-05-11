<template>
  <main>
    <h1>Abonnme</h1>
    <section class="my-services-section">
      <div v-if="isMobile">
        <button class="btn bg-yellow" style="margin-right: 5px" @click="openAddModal">Ajouter</button>
        <button class="btn bg-blue" @click="toCSV(myServices, totalAmount)">Exporter en excel</button>
      </div>
      <div class="my-services-header">
        <h2 class="green-underline">Mes abonnements {{ totalAmount > 0 ? `${totalAmount}€` : null }}</h2>
        <div v-if="!isMobile">
          <button class="btn bg-yellow" style="margin-right: 5px" @click="openAddModal">Ajouter</button>
          <button class="btn bg-blue" @click="toCSV(myServices, totalAmount)">Exporter en excel</button>
        </div>
      </div>
      <div v-if="myServices.length > 0" class="flex">
        <MyServicesCard class="bg-green" v-for="(item, key) in myServices" :key="key" :service="item"
                        @click="removeFromSelection(key)"/>
      </div>
      <div v-else>
        <p>Aucun abonnement sélectionné pour le moment</p>
      </div>
    </section>
    <section class="streaming-section">
      <h2 class="yellow-underline">Streaming</h2>
      <div class="flex">
        <CardService class="bg-yellow" v-for="(item, key) in streamingServices" :key="key" :service="item"
                     @click="openPriceModal(item)"/>
      </div>
    </section>
    <section class="music-section">
      <h2 class="red-underline">Musique</h2>
      <div class="flex">
        <CardService class="bg-red" v-for="(item, key) in musiqueServices" :key="key" :service="item"
                     @click="openPriceModal(item)"/>
      </div>
    </section>
    <section class="other-section">
      <h2 class="blue-underline">Autres dépenses</h2>
      <div class="flex">
        <CardService class="bg-blue" v-for="(item, key) in otherServices" :key="key" :service="item"
                     @click="openPriceModal(item)"/>
      </div>
    </section>
    <ModalPrice
        v-if="showModalPrice"
        :service="serviceSelected"
        @select="selected"
        @add="selected"
        @close="closeModalPrice"
    />
    <ModalAdd
        v-if="showModalAdd"
        :service="serviceSelected"
        @add="addTo"
        @close="closeModalAdd"
    />
  </main>
  <footer>
    <p>Abonnme - 2025 | Développé par <a href="https://github.com/CorentinNrd" target="_blank">Corentin Nrd</a></p>
  </footer>
</template>

<script setup>
import {computed, watch, ref, onMounted} from 'vue';
import {toCSV} from "./composables/toCSV.js";
import STREAMINGSERVICES from './data/streamingServices.json';
import MUSIQUESERVICES from './data/musiqueServices.json';
import OTHERSERVICES from './data/otherServices.json';
import CardService from "./components/cardService.vue";
import MyServicesCard from "./components/myServicesCard.vue";
import ModalPrice from "./components/modalPrice.vue";
import ModalAdd from "./components/modalAdd.vue";

const showModalPrice = ref(false);
const showModalAdd = ref(false);
const serviceSelected = ref(null);
const myServices = ref([]);
const streamingServices = ref([]);
const musiqueServices = ref([]);
const otherServices = ref([]);

const isMobile = computed(() => window.matchMedia("(max-width: 600px)").matches);

const totalAmount = computed(() => {
  const total = myServices.value.reduce((acc, service) => {
    return acc + parseFloat(service?.price);
  }, 0);
  if (isNaN(total)) {
    return 0;
  }
  return total?.toFixed(2);
});

const selected = (item) => {
  let existingService = myServices.value.find(service => service?.item.id === item.item.id);
  if (existingService) {
    myServices.value.splice(myServices.value.indexOf(existingService), 1);
  }
  myServices.value.push(item);
  closeModalPrice();
};

const addTo = (itemToAdd) => {
  const existingService = myServices.value.find(service => service?.item.id === itemToAdd.item.id);
  if (existingService) {
    myServices.value.splice(myServices.value.indexOf(existingService), 1);
  }
  myServices.value.push(itemToAdd);
  const storedNewServices = localStorage.getItem('abonnmeNewServices');
  const serviceToStore = {
    id: itemToAdd.item.id,
    name: itemToAdd.item.name,
    type: itemToAdd.item.type,
  };
  if (storedNewServices) {
    const parsedServices = JSON.parse(storedNewServices);
    if (Array.isArray(parsedServices)) {
      const existingService = parsedServices.find(service => service?.item.id === serviceToStore.item.id);
      if (existingService) {
        parsedServices.splice(parsedServices.indexOf(existingService), 1);
      }
      parsedServices.push(serviceToStore);
      localStorage.setItem('abonnmeNewServices', JSON.stringify(parsedServices));
    } else {
      localStorage.setItem('abonnmeNewServices', JSON.stringify([parsedServices, serviceToStore]));
    }
  } else {
    localStorage.setItem('abonnmeNewServices', JSON.stringify([serviceToStore]));
  }
  closeModalAdd();
};

const openPriceModal = (item) => {
  const existingService = myServices.value.find(service => service?.item?.id === item?.id);
  serviceSelected.value = existingService ? existingService : item;
  showModalPrice.value = true;
};

const openAddModal = () => {
  showModalAdd.value = true;
};

const closeModalPrice = () => {
  serviceSelected.value = null;
  showModalPrice.value = false;
};

const closeModalAdd = () => {
  showModalAdd.value = false;
};

const removeFromSelection = (key) => {
  myServices.value.splice(key, 1);
};

const init = () => {
  streamingServices.value = STREAMINGSERVICES;
  musiqueServices.value = MUSIQUESERVICES;
  otherServices.value = OTHERSERVICES;

  const storedNewServices = localStorage.getItem('abonnmeNewServices');
  if (storedNewServices) {
    const parsedServices = JSON.parse(storedNewServices);
    otherServices.value = otherServices.value.concat(parsedServices);
  }
};

watch(myServices, (newValue) => {
  localStorage.removeItem('abonnme')
  localStorage.setItem('abonnme', JSON.stringify(newValue));
}, {deep: true});

onMounted(() => {
  init();
  const storedServices = localStorage.getItem('abonnme');
  if (storedServices) {
    myServices.value = JSON.parse(storedServices);
  }
});
</script>

<style scoped>
main {
  width: 100%;
  padding: 20px;
}

.streaming-section, .music-section, .my-services-section, .other-section {
  text-align: left;
}

h2 {
  position: relative;
  text-decoration: none;
  display: inline-block;
}

h2::before {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 15px;
  width: 100%;
  height: 6px;
}

.flex {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.my-services-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 600px) {
  main {
    width: 100%;
    padding: unset;
  }

  .streaming-section, .music-section, .my-services-section, .other-section {
    text-align: left;
    padding-left: 20px;
  }

  .my-services-header {
    width: auto;
    max-width: unset;
    min-width: unset;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
