<template>
    <div class="container-fluid pt-3">
        <div class="text-center mb-4">
            <button class="btn cus_btn" @click="btnAddUser"><font-awesome-icon :icon="['fas', 'user-plus']" /> Create New Employee</button>
        </div>
        <div class="row employeeInfo">
            <!-- Get Users Info -->
            <aside class="col-lg-3 col-md-4 col-sm-6 col-12" v-for="(data,idx) in userInfo" :key="idx">
              
                <div class="cardWrap">     
                  <div class="wrapParent">
                    <div class="userImg">
                        <figure>
                            <img :src="getImage(data.photo)"/>
                        </figure>                        
                        <span class="userName">{{ data.username }}</span>
                        <span class="userDesignation">{{ getUserType(data.job_role) }}</span>
                    </div>
                    <ul>
                        <li><font-awesome-icon :icon="['fas', 'id-badge']" /> {{ data.emp_id }}</li>                        
                        <li><font-awesome-icon :icon="['fas', 'lock']" />    {{ data.username }}</li>
                        <li v-if="data.email != ''"><font-awesome-icon :icon="['fas', 'envelope']" /> {{ data.email }}</li>
                        <li><font-awesome-icon :icon="['fas', 'user-check']" /> {{ getUerRole(data.user_role) }}</li>                        
                        <li v-if="data.phoneno != ''"><font-awesome-icon :icon="['fas', 'square-phone']" /> {{ data.phoneno }}</li>
                        <li v-if="data.address != ''"><font-awesome-icon :icon="['fas', 'location-dot']" /> {{ data.address }}</li>
                        <li v-if="data.qualification != ''"><font-awesome-icon :icon="['fas', 'graduation-cap']" /> {{ data.qualification }}</li>
                        <li v-if="data.skills != ''"><font-awesome-icon :icon="['fas', 'user-gear']" /> {{ data.skills }}</li>
                    </ul>
                    <div class="d-flex justify-content-between actions">
                      <button class="btn cus_btn" @click="btnEditUser(idx)"><font-awesome-icon :icon="['fas', 'user-pen']" /></button>                      
                      <button class="btn cus_btn btn-success" @click="btnGetProgress(data)" v-if="(data.id != 1 && data.id != 2)"><font-awesome-icon :icon="['fas', 'chart-line']" /></button>
                      <button class="btn cus_btn btn-danger" @click="btnDeleteUser(data.emp_id)"><font-awesome-icon :icon="['fas', 'trash']" /></button>
                    </div>
                  </div>                    
                </div>
            </aside>
        </div>
    </div>
</template>
<script>
import ModalService from "@/modules/modals/services/modal.service";
import UserInfoEdit from "./modals/UserInfoEdit.vue";
import AddNewUser from "./modals/AddNewUser.vue";
import { fetchAPIInfo, getFolderPath, getAllUserDBInfo } from "@/assets/script/common";
import ConfirmationMessage from "../views/modals/ConfirmationMessage.vue";
import EmployeeWorkProgress from "../views/modals/EmployeeWorkProgress.vue";
import { eventBus } from "@/main";
import axios from "axios";

export default {
  name: "EmployeeInfo",
  data() {
    return {
      userInfo: [],
    };
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    eventBus.$on("btnRefresh",()=>{
      this.getUserInfo();
    });
    eventBus.$on("isRemoveUser",(idx)=>{
      this.removeSelUser(idx);
    });
    eventBus.$on("getalluserinfo",(resp)=>{
      this.userInfo = resp;
    });
  },
  destroyed() {
    eventBus.$off("btnRefresh");
    eventBus.$off("isRemoveUser");
    eventBus.$off("getalluserinfo");
  },
  methods: {
    /* ----------------------------  Get User Info ----------------------------------------*/
    async getUserInfo() {
      getAllUserDBInfo();
    },
    /* ------------------------ Display Dynamic Image -------------------------------------*/
    getImage: function(img) {
			let getImg = axios.defaults.baseURL + "/static/images/" + getFolderPath() + img.toString();
			return (img == "") ? this.$store.state.getImg : getImg;
		},
    /* ------------------------ Get User Role ---------------------------------------------*/
    getUerRole: function(idx) {
      let roles = ['Super Admin','Admin','Manager','Employee'];
      return roles[idx];
    },
    /* ------------------------ Get User Type ---------------------------------------------*/
    getUserType: function(idx) {
      let roles = ['Software Engineer','Fullstack Developer','Frontend Developer','Backend Developer','Tester', 'UI Designer'];
      return roles[idx];
    },
    /* ---------------------  Add New User ----------------------------------------*/
    btnAddUser: function() {
      ModalService.open(AddNewUser);
    },
    /* ---------------------  Edit User Info ----------------------------------------*/
    btnEditUser: function(idx) {
      ModalService.open(UserInfoEdit, [{ nameValues: this.userInfo}, {idx: idx}]);
    },
    btnDeleteUser: function(idx) {
      ModalService.open(ConfirmationMessage, [{ msgTitle: "", msgInfo: "Are you sure you want to remove selected user?", nameValues:[idx] }]);
    },
    async btnGetProgress(data) {
      let prodIdx = JSON.parse(localStorage.getItem("product_idx" + sessionStorage.getItem("access_token").toString()));
      let resp = await fetchAPIInfo('get', '/getemptaskprogress?prod_id=' + prodIdx['prod_idx'] + '&emp_id=' + data.emp_id.toString());

      ModalService.open(EmployeeWorkProgress, [{"getProInfo": resp.data},{ "selIdx" : data.id}]);
    },
    async removeSelUser(emp_id) {
      let resp = await fetchAPIInfo('post', '/deleteuser?emp_id=' + emp_id.toString());
			if(resp.status == 200) {
				this.getUserInfo();
			}
    }
  },
};
</script>
