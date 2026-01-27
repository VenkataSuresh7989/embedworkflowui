<template>
  <section :class="{ 'modal-root': modal.component }">
    <transition name="modal">
      <component v-if="modal" :is="modal.component" v-bind:close="modal.close" v-bind:dismiss="modal.dismiss" v-bind="modal.props" :class="{ 'd-block': modal.component }" />
    </transition>
  </section>
</template>

<script>
import ModalService from '../services/modalsubchild.service';
import Modal from './ModalScreen.vue';
import {store} from '../../../store/index'
export default {
  components: { Modal },
  data() {
    return {
      modal: {},
    }
  },
  created() {
    // ModalService.$on('open', ({ component, props, resolve, reject }) => {
    ModalService.$on('open', ({ component, props, resolve }) => {
      this.modal = {
        component,
        props,
        close: value => {
          this.modal = {};
          resolve(value);
        },
        dismiss: reason => {
          this.modal = {};  
          store.state.gblConsolePrints.push(reason);
          // reject(reason);
        },
      };
    });
    ModalService.$on('close', (resolve) => {
      this.modal = {};
      store.state.gblConsolePrints.push(resolve);
    });

  }
}
</script>

<style scoped>
.modal-root {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 1, 1, 0.2);
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease-out;
}
.modal-enter,
.modal-leave-to {
  transform: translateY(25px);
  opacity: 0;
}
</style>