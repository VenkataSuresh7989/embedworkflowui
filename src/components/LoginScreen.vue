<template>
	<div class="login_content">
		<div class="main">
			<div class="login">
				<div class="text-center">
					<h3 style="color:#fff"><strong>EMBED TECHNOLOGIES</strong></h3> <img  class="embed_logo" :src="$store.state.getImg" alt="" /> </div>
				<div class="container-fluid">
					<form @submit.prevent="btnLogin()">
						<div class="mb-3">
							<label for="exampleInputEmail1" class="form-label">User Name</label>
							<input type="text" v-model="txtUsername" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"> </div>
						<div class="mb-3">
							<label for="exampleInputPassword1" class="form-label">Password</label>
							<input type="password" v-model="txtPassword" class="form-control" id="exampleInputPassword1"> </div>
						<div class="text-center">
							<button style="background: #121253;" type="submit" class="btn btn-primary">Login</button>
						</div>
						<div class="text-center" v-if="isErrMsg"><span style="font-size: 15px;" class="text-danger"><strong>{{ txtErrMsg }}</strong></span></div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { fetchAPIInfo } from "@/assets/script/common";

export default {
  name: "LoginScreen",
  data() {
    return {
      txtUsername: "",
      txtPassword: "",
      txtErrMsg: "",
      formData: {},
    };
  },
  computed: {
    isErrMsg: function () {
      return this.txtErrMsg != "" ? true : false;
    },
  },
  methods: {
    async btnLogin() {
      try {
        let formData = new FormData();
        formData.append("username", this.txtUsername);
        formData.append("password", this.txtPassword);

        const response = await fetchAPIInfo("post", "/token", formData, true);

        if (!response) {
          throw new Error("Invalid username or password");
        }

        this.txtErrMsg = "";

        const tokenKey = Date.now().toString();
        sessionStorage.setItem("access_token", tokenKey);
        localStorage.setItem(
          "login_user" + tokenKey,
          JSON.stringify(response.user_info)
        );
        localStorage.setItem(
          "access_token" + tokenKey,
          response.access_token
        );

        this.txtUsername = "";
        this.txtPassword = "";

        window.location.href = "/";
      } catch (error) {
        console.error("Login error:", error);       

        if( error?.message || error.response.data.detail == "Password mismatch." || error.response.data.detail == "User not found.")
        {
          this.txtErrMsg = error.response.data.detail;
        }

        setTimeout(() => {
          this.txtErrMsg = "";
        }, 5000);
      }
    }

  },
};
</script>
