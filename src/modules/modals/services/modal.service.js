import Vue from 'vue';
import {store} from '../../../store/index';
export default new Vue({
  methods: {
    open(component, props = {}) {
      return new Promise((resolve, reject) => {
        store.popupName = component.name;
        this.$emit('open', { component, props, resolve, reject });              
      });
    },
    close(){
      return new Promise((resolve) => {
        this.$emit('close', { resolve });
      });
    },
  },
});
