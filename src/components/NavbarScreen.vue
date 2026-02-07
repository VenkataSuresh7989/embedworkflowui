<template>
	<div class="header">
		<b-navbar toggleable="lg" type="dark" class="header">
			<!-- <img :src="$store.state.getImg" class="header_logo"> -->
			<b-navbar-brand href="#">Embed Technologies</b-navbar-brand>
			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
			<b-collapse id="nav-collapse" is-nav>
				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">					
					<b-navbar-nav>
						<b-nav-item @click="getRoute('/')" :class="{ show: true }" :active="($route.path == '/') ? true : false"><font-awesome-icon :icon="['fas', 'house']"/> Home</b-nav-item>
						<b-nav-item href="#" @click="btnRefresh" :class="{ show: true }">
							<font-awesome-icon :icon="['fas', 'arrows-rotate']" /> Refresh
						</b-nav-item>		
									
						<b-nav-item-dropdown text="Options" right :class="{ show: true }"  :active="isOptionsActive">
							<template #button-content>
								<font-awesome-icon :icon="['fas', 'gear']" /> Options
							</template>						
							<b-dropdown-item :active="$route.path === '/tasks'" @click="getRoute('/tasks')">Tasks</b-dropdown-item>
							<b-dropdown-item :active="$route.path === '/builds'" @click="getRoute('/builds')">Builds & Releases</b-dropdown-item>
							<b-dropdown-item :active="$route.path === '/versions'" @click="getRoute('/versions')">Versions</b-dropdown-item>
							<b-dropdown-item :active="$route.path === '/employee'" @click="getRoute('/employee')" v-if="isDisable">Employee</b-dropdown-item>
						</b-nav-item-dropdown>

						<b-nav-item-dropdown text="Tools" right :class="{ show: true }"  :active="isToolActive">
							<template #button-content>
								<font-awesome-icon :icon="['fas', 'sitemap']" /> Tools
							</template>						
							<b-dropdown-item :active="$route.path === '/msamtool'" @click="getRoute('/msamtool')">MSAM</b-dropdown-item>
							<b-dropdown-item :active="$route.path === '/fuota'" @click="getRoute('/fuota')">FUOTA</b-dropdown-item>
							<b-dropdown-item :active="$route.path === '/loopback'" @click="getRoute('/loopback')">Loopback</b-dropdown-item>
							<b-dropdown-item :active="$route.path === '/buildflow'" @click="getRoute('/buildflow')">Build Flow</b-dropdown-item>							
						</b-nav-item-dropdown>

						<b-nav-item-dropdown text="Themes" right :class="{ show: true }">
							<b-dropdown-item v-for="theme in themes" :key="theme.value" @click="changeTheme(theme.value)" :active="theme.value === currentTheme">
								{{ theme.name }}
							</b-dropdown-item>
						</b-nav-item-dropdown>
						<b-nav-item-dropdown right :class="{ show: true }">
							<template #button-content>
								<font-awesome-icon :icon="['fas', 'user-gear']" /> {{ getName}}
							</template>
							<b-dropdown-item @click="btnProfile" v-if="!isDisable">Profile</b-dropdown-item>
							<b-dropdown-item @click="btnLogout">Sign Out</b-dropdown-item>
						</b-nav-item-dropdown>
					</b-navbar-nav>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>
	</div>
</template>

<script>
import { eventBus } from "@/main";
import ModalService from "@/modules/modals/services/modal.service";
import ConfirmationMessage from "@/views/modals/ConfirmationMessage.vue";
import ProfileInfo from "../views/modals/ProfileInfo.vue";
import { getUser, getUserRole } from "@/assets/script/common";

export default {
  name: "NavbarScreen",
	data() {
		return {
			themes: [
				{ name: "Default", value: "theme-default" },
				{ name: "Ocean Blue", value: "theme-ocean" },
				{ name: "Sunset Orange", value: "theme-sunset" },
				{ name: "Forest Green", value: "theme-forest" },
				{ name: "Purple Dream", value: "theme-purple" },
				{ name: "Classic Gray", value: "theme-gray" },
				{ name: "Fire Red", value: "theme-fire" },
				{ name: "Deep Blue", value: "theme-deepblue" },
				{ name: "Teal Calm", value: "theme-teal" },
				{ name: "Golden Yellow", value: "theme-gold" },
				{ name: "Dark Mode", value: "theme-dark" },
			],
			currentTheme: ''
		}
	},
  computed: {
	isOptionsActive() {
        return ['/tasks', '/builds', '/employee'].includes(this.$route.path);
    },
	isToolActive() {
        return ['/msamtool'].includes(this.$route.path);
    },
    isDisable: function() {
      let roleIdx = getUserRole();
      return ((roleIdx == 0) || (roleIdx == 1)) ? true : false;
    },
	getName: function() {
		let roleIdx = getUserRole();
		let logUser = getUser();
		return (roleIdx == 0) ? "Super Admin" : (roleIdx == 1) ? "Admin" : this.capitalizeFirstLetter(logUser["username"]);
	},
  },
  mounted() {
	this.loadTheme();

    eventBus.$on("isSignout", () => {
      this.logoutConfMsg();
    });
  },
  destroyed() {
    eventBus.$off("isSignout");
  },
  methods: {
	changeTheme(themeName) {
      document.body.className = document.body.className
        .split(' ')
        .filter(c => !c.startsWith('theme-'))
        .join(' ');

      document.body.classList.add(themeName);
      const sessionKey = 'dashboard-theme-' + sessionStorage.getItem('access_token');
      localStorage.setItem(sessionKey, themeName);

      this.currentTheme = themeName;
    },
    loadTheme() {
		const sessionKey = 'dashboard-theme-' + sessionStorage.getItem('access_token');
		const savedTheme = localStorage.getItem(sessionKey);
		
		console.log("Current Theme", this.currentTheme);

		let getDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

		let dayThemes = {
			"Sunday" : "theme-ocean",
			"Monday" : "theme-sunset",
			"Tuesday" : "theme-forest",
			"Wednesday" : "theme-purple",
			"Thursday" : "theme-teal",
			"Friday" : "theme-gray",
			"Saturday" : "theme-deepblue"
		}

		this.currentTheme = (savedTheme) ? savedTheme : dayThemes[getDay] || 'theme-default';

		
		document.body.classList.add(this.currentTheme);		
    },
	capitalizeFirstLetter(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    getRoute: function (route) {
		if(this.$route.path !== route.toString()) {
			this.$router.push(route.toString());
		}
    },
    btnRefresh: function () {
      eventBus.$emit("btnRefresh");
    },
	btnProfile: function() {
		ModalService.open(ProfileInfo, [{ nameValues: getUser()}]);
	},
	logoutConfMsg: function() {
		Object.keys(localStorage).forEach((itemId) => {
			let resp = itemId.toString().includes(sessionStorage.getItem("access_token").toString());
			if (resp)
				localStorage.removeItem(itemId.toString());
		});
		sessionStorage.clear();
		setTimeout(() => {
			this.$router.replace("/login");
			window.location.reload();
		}, 500);
	},
    btnLogout: function () {
      ModalService.open(ConfirmationMessage, [{ msgTitle: "", msgInfo: "Are you sure you want to Logout?" }]);
    },
  },
};
</script>
