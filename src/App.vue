<template>
  <div>
    <Navbar v-if="getUser" />    
    <div class="bodyPart">
      <router-view />
      <ModalRoot />
      <ModalChild />
      <ModalSubChild />
    </div>
    <footer v-if="getUser">
      <span class="copyright-text">© 2024 Embed Technologies. All Rights Reserved.</span>
    </footer>
  </div>
</template>
<script>
import Navbar from "./components/NavbarScreen.vue";
import ModalRoot from "./modules/modals/components/ModalRoot.vue";
import ModalChild from "./modules/modals/components/ModalChild.vue";
import ModalSubChild from "./modules/modals/components/ModalSubChild.vue";

export default {
  name: "App",
  components: {
    Navbar,
    ModalRoot,
    ModalChild,
    ModalSubChild,
  },
  computed: {
    getUser: function () {
      let user = localStorage.getItem("login_user" + sessionStorage.getItem("access_token"));
      return user != undefined || user != null ? true : false;
    },
  },
};
</script>
