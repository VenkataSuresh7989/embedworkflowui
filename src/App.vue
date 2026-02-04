<template>
  <div  v-if="getUser">
    <Navbar/>    
    <div class="" :class="getUser ? 'bodyPart' : 'bodyPart full'">
      <router-view />      
      <ModalRoot />
      <ModalChild />
      <ModalSubChild />
      <div :class="showPanel ? 'isOpen quickPanel' : 'quickPanel'">
        <button class="btn cus_btn quickPanelBtn" :class="showPanel ? 'window' : ''" v-on:click="displayPanel"><font-awesome-icon :icon="['fas', 'right-left']" /></button>
        <div :class="showPanel ? 'toggleWindow' : 'isOpen toggleWindow'">
          <QuickmenuScreen />
        </div>
      </div>      
    </div>
    <footer>
      <span class="copyright-text">© 2000–{{ currentYear }} Embed Technologies. All Rights Reserved.</span>
    </footer>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>
<script>
import Navbar from "./components/NavbarScreen.vue";
import ModalRoot from "./modules/modals/components/ModalRoot.vue";
import ModalChild from "./modules/modals/components/ModalChild.vue";
import ModalSubChild from "./modules/modals/components/ModalSubChild.vue";
import QuickmenuScreen from "./components/QuickmenuScreen.vue";

export default {
  name: "App",
  data() {
    return {
      showPanel: false,
      currentYear: new Date().getFullYear()
    };
  },
  components: {
    Navbar,
    ModalRoot,
    ModalChild,
    ModalSubChild,
    QuickmenuScreen
  },
  computed: {
    getUser: function () {
      let user = localStorage.getItem("login_user" + sessionStorage.getItem("access_token"));
      return user != undefined || user != null ? true : false;
    },
  },
  methods: {
    displayPanel() {
      this.showPanel = !this.showPanel;
    }
  }
};
</script>
