<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title"><strong>Profile</strong></h6>
			<div>
				<button class="btn cus_btn" @click="modalDismiss">
					<font-awesome-icon :icon="['fas', 'xmark']" />
				</button>
			</div>
		</ModalHeader>
		<ModalBody>
			<div class="row">
                <div class="col-sm-12">
					<div class="mb-3 text-center newUser">
						<div class="userWrap">
                            <div class="parentWrap">
                                <figure class="userImg">
                                    <img :src="getImgUrl(selectedFile)" alt="" />
                                    <div class="updateUser">
                                        <div class="customUpload">
                                            <input type="file" name="files" ref="userimg" accept=".jpg, .png" multiple @change="handleFileChange" />
                                            <span><font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" /></span>
                                        </div>                                    
                                    </div>
                                </figure>
                                <div class="uploadImage" v-if="Object.keys(this.selectedFile).length == 1">
                                    <button class="btn" @click="removeSelectedFile()"><span><font-awesome-icon :icon="['fas', 'xmark']" /></span> </button>
                                </div>
                            </div>
                        </div>
                    </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputEmailId" class="form-label">Employee Id</label>
						<input type="text" class="form-control" id="exampleInputEmailId" aria-describedby="emailHelp" v-model="getInfo.emp_id" @change="handleChange($event, 'emp_id')" :disabled="getUserRole">
                    </div>
				</div>				
				<div class="col-sm-6">
					<div class="mb-3">
						<label class="form-label">User Role</label>
						<select class="form-select" aria-label="Default select example" v-model="getInfo.user_role" @change="handleChange($event, 'user_role')" :disabled="getUserRole">
							<option value="" selected>-- select user role --</option>
							<option value="0">Super Admin</option>
							<option value="1">Admin</option>
                            <option value="2">Manager</option>
							<option value="3">Employee</option>
						</select>
					</div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label class="form-label">Job Role</label>
						<select class="form-select" aria-label="Default select example" v-model="getInfo.job_role" @change="handleChange($event, 'job_role')" :disabled="getUserRole">
							<option value="" selected>-- select job role --</option>
							<option value="0">Software Engineer</option>
							<option value="1">Full Stack Developer</option>
                            <option value="2">Frontend Developer</option>
							<option value="3">Backend Developer</option>
                            <option value="4">Tester</option>
							<option value="5">UI Designer</option>
						</select>
					</div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleUsername" class="form-label">User Name</label>
						<input type="text" class="form-control" id="exampleUsername" aria-describedby="emailHelp" v-model="getInfo.username" @change="handleChange($event, 'username')" :disabled="getUserRole">
                    </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="examplePassword" class="form-label">Password</label>
						<input type="text" class="form-control" id="examplePassword" aria-describedby="emailHelp" v-model="getInfo.password" @change="handleChange($event, 'password')" :disabled="getUserRole">
                    </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputEmail" class="form-label">Email</label>
						<input type="email" class="form-control" id="exampleInputEmail" aria-describedby="emailHelp" v-model="getInfo.email" @change="handleChange($event, 'email')" :disabled="getUserRole">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputQualification" class="form-label">Qualification</label>
						<input type="text" class="form-control" id="exampleInputQualification" aria-describedby="emailHelp" v-model="getInfo.qualification" @change="handleChange($event, 'qualification')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputNumber" class="form-label">Phone Number</label>
						<input type="text" class="form-control" id="exampleInputNumber" aria-describedby="emailHelp" v-model="getInfo.phoneno" @change="handleChange($event, 'phoneno')">
                    </div>
				</div>
				<div class="col-sm-12">
					<div class="mb-3">
						<label for="exampleInputAddress" class="form-label">Address</label>
						<textarea type="text" class="form-control" id="exampleInputAddress" aria-describedby="emailHelp" v-model="getInfo.address" @change="handleChange($event, 'address')"></textarea>
					</div>
				</div>
			</div>
		</ModalBody>
		<ModalFooter>
			<div>
				<button class="btn cus_btn" v-on:click="updateBuild">Update</button>
				<button class="btn cus_btn ml-2 btn-danger" @click="modalDismiss">Close</button>
			</div>
		</ModalFooter>
	</Modal>
</template>

<script>
import ModalService from "../../modules/modals/services/modalchild.service";
import InformationMessage from "../../views/modals/InformationMessage.vue";
import Modal from "../../modules/modals/components/ModalScreen.vue";
import ModalHeader from "../../modules/modals/components/ModalHeader.vue";
import ModalBody from "../../modules/modals/components/ModalBody.vue";
import ModalFooter from "../../modules/modals/components/ModalFooter.vue";
import ModalMixin from "../../modules/modals/mixins/ModalMixin";
import { chgDataFormat, fetchAPIInfo, getLabelInfo, getUser } from "@/assets/script/common";
import { eventBus } from "@/main";
import axios from "axios";


export default {
  name: "ProfileInfo",
  components: { Modal, ModalHeader, ModalBody, ModalFooter },
  data() {
    return {
      getInfo: {},
      chgData: {},
		selectedFile: [],
    };
  },
  mixins: [ModalMixin],
  props: {
    nameValues: Object,
  },
  created() {
    this.getInfo = this.$props["nameValues"];
    this.chgData = {};
  },
  computed: {
	/* --------------------------------------  Get User Role ---------------------------------------------*/
    getUserRole: function() {
        let role = this.$props["nameValues"]["user_role"];
        return (role !== "0" || role !== "1") ? true : false;
    }
  },
  methods: {
	/* --------------------------------------  Close the modal -------------------------------------------*/
    modalDismiss: function () {
        this.chgData = {};
        this.dismiss("Modal dismissed");
    },
	/* ----------------------------------  Updated Build Information -------------------------------------*/
    async updateBuild() {
        /* ------------------- If user update username and passowrd logout current account. ------------- */
        for (let chgInfo in this.chgData) {
            if (this.chgData[chgInfo].value.trim() == "") {
                ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: getLabelInfo(chgInfo) + " cannot be empty."}]);
                return;
            }
        }

		if((Object.keys(this.chgData).length == 0 && this.selectedFile.length == 0)) {
			this.chgData = {};
			this.modalDismiss();
		} else {
			let chgArr = chgDataFormat(this.chgData);
			chgArr = [chgArr[0]];
			let response;
			if(this.selectedFile.length == 1) {					
				let formData = new FormData();
				formData.append("files", this.selectedFile[0]);
				response = await fetchAPIInfo("post", "/updateuser?emp_id=" +  this.$props["nameValues"]["emp_id"] + "&data=" + JSON.stringify(chgArr), formData, true);
			}
			else
				response = await fetchAPIInfo("post", "/updateuser?emp_id=" +  this.$props["nameValues"]["emp_id"] + "&data=" + JSON.stringify(chgArr));
			
			if(response.status == 200) {
				this.dismiss("Modal dismissed");
				eventBus.$emit("isSignout");
			}else {
				ModalService.open(InformationMessage, [{ msgTitle: "Information Message", msgInfo: response.data }]);
			}
		}
    },
    handleChange: function(event,key) {
        let resp = getUser();
        if (resp[key] != event.target.value) {
            this.chgData[key.toString()] = {"key" : key.toString(), "value" : event.target.value};
        } else {
            if (key in this.chgData) {
                delete this.chgData[key];
            }
        }
    },
	/* ----------------------------------  Display Dynamic Image -------------------------------------*/
	getImgUrl: function(file) {
		return (file.length == 0) ? (this.getInfo.photo == "" ? "https://i.postimg.cc/3JgdwgnG/Screenshot-2023-11-21-100758.png" : axios.defaults.baseURL + "/static/images/users/"  + this.getInfo.photo) : URL.createObjectURL(file[0]);
	},
	/* ----------------------------------  Remove Selected Image ------------------------------------*/
	removeSelectedFile() {
		this.selectedFile = [];
	},
	/* ----------------------------------  Upload image ---------------------------------------------*/
	handleFileChange(event) {
		if(Object.keys(this.selectedFile).length == 1) {
			this.selectedFile = [];
		}
		this.selectedFile = event.target.files;
	},
	/* ----------------------------  Clear the seleced image ----------------------------------------*/
	clearFileInput() {
		this.$refs.userphoto.value = "";
	},
  }
};
</script>
