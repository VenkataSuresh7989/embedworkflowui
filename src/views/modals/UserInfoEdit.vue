<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title"><strong>Edit User Information </strong></h6>
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
					<div class="mb-2">
						<label for="exampleUserId" class="form-label">Employee Id</label>
						<input type="text" class="form-control" maxlength="9" id="exampleUserId" v-model="getInfo.emp_id" aria-describedby="emp_id" @change="handleChange($event,'emp_id')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-2">
						<label for="exampleUserEditName" class="form-label">Username</label>
						<input type="text" class="form-control" id="exampleUserEditName" v-model="getInfo.username" aria-describedby="username" @change="handleChange($event,'username')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-2">
						<label for="exampleUserEditPwd" class="form-label">Password</label>
						<input type="text" class="form-control" id="exampleUserEditPwd" v-model="getInfo.password" aria-describedby="password" @change="handleChange($event,'password')">
                    </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-2">
						<label for="exampleUserEditPhn" class="form-label">Phone No</label>
						<input type="text" class="form-control" id="exampleUserEditPhn" v-on:keyup="isNumeric($event)" maxlength="10" v-model="getInfo.phoneno" aria-describedby="phoneno" @change="handleChange($event,'phoneno')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-2">
						<label for="exampleUserEmailId" class="form-label">Email</label>
						<input type="email" class="form-control" id="exampleUserEmailId" v-model="getInfo.email" aria-describedby="email" @change="handleChange($event,'email')">
                    </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-2">
						<label for="exampleUserEditQualf" class="form-label">Qualification</label>
						<input type="text" class="form-control" id="exampleUserEditQualf" v-model="getInfo.qualification" aria-describedby="qualification" @change="handleChange($event,'qualification')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-2">
						<label class="form-label">User Role</label>
						<select class="form-select" aria-label="Default select example" v-model="getInfo.user_role" @change="handleChange($event,'user_role')">
							<option value="" selected>-- select user role --</option>
							<option value="0">Super Admin</option>
							<option value="1">Admin</option>
                            <option value="2">Manager</option>
							<option value="3">Employee</option>
						</select>
					</div>
				</div>
                <div class="col-sm-6">
					<div class="mb-2">
						<label class="form-label">Job Role</label>
						<select class="form-select" aria-label="Default select example" v-model="getInfo.job_role" @change="handleChange($event,'job_role')">
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
					<div class="mb-2">
						<label for="exampleUserEditSkill" class="form-label">Skills</label>
						<input type="text" class="form-control" id="exampleUserEditSkill" v-model="getInfo.skills" aria-describedby="skills" @change="handleChange($event,'skills')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-2">
						<label for="exampleUSerEditAddress" class="form-label">Address</label>
						<textarea class="form-control" id="exampleUSerEditAddress" v-model="getInfo.address" aria-describedby="address" @change="handleChange($event,'address')"></textarea>
                    </div>
				</div>                
			</div>
		</ModalBody>
		<ModalFooter>
			<div>
				<button class="btn cus_btn" @click="updateUser">Update User</button>
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
import { chgDataFormat, fetchAPIInfo, getAllUserInfo, getLabelInfo, getSelIdxInfo, onlyNumbers } from "@/assets/script/common";
import { eventBus } from "@/main";
import axios from "axios";
export default {
    name: "UserInfoEdit",
    data() {
        return {
            getInfo: {},
            chgData: {},
			selectedFile: [],
        }
    },
    props: {
        nameValues: Array,
        idx: Number
    },
    mixins: [ModalMixin],
    components: { Modal, ModalHeader, ModalBody, ModalFooter },
    created() {
        this.getInfo = this.$props["nameValues"][this.$props["idx"]];
		localStorage.setItem("editInfo" + sessionStorage.getItem("access_token").toString(), JSON.stringify(this.getInfo));
    },
    methods: {
        modalDismiss: function () {
            this.chgData = {};
			getSelIdxInfo("DELETE");
            this.dismiss("Modal dismissed");
        },
        isNumeric: function (event) {   
			let resVal = onlyNumbers(event.target.value.toString());       
			event.target.value = resVal;  
		},
        handleChange: function(event,key) {
            let resp = getAllUserInfo();
            resp = resp[this.$props["idx"]];
            if (resp[key] != event.target.value) {
                this.chgData[key.toString()] = {"key" : key.toString(), "value" : event.target.value};
            } else {
                if (key in this.chgData) {
                    delete this.chgData[key];
                }
            }
        },
        async updateUser() {
            for (let chgInfo in this.chgData) {
                if (this.chgData[chgInfo].value.trim() == "") {
                    ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: getLabelInfo(chgInfo) + " cannot be empty."}]);
                    return;
                }
            }

			let orgInfo = getSelIdxInfo("GET");

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
					response = await fetchAPIInfo("post", "/updateuser?emp_id=" +  orgInfo['emp_id'] + "&data=" + JSON.stringify(chgArr), formData, true);
				}
				else
					response = await fetchAPIInfo("post", "/updateuser?emp_id=" +  orgInfo['emp_id'] + "&data=" + JSON.stringify(chgArr));
				if(response.status == 200) {
					this.modalDismiss();
					eventBus.$emit("btnRefresh");
				}else {
					ModalService.open(InformationMessage, [{ msgTitle: "Information Message", msgInfo: response.data }]);
				}
			}
        },
		getImgUrl: function(file) {
			return (file.length == 0) ? (this.getInfo.photo == "" ? "https://i.postimg.cc/3JgdwgnG/Screenshot-2023-11-21-100758.png" : axios.defaults.baseURL + "/static/images/users/"  + this.getInfo.photo) : URL.createObjectURL(file[0]);
		},
        removeSelectedFile() {
			this.selectedFile = [];
		},
        /* Image Upload */
		handleFileChange(event) {
            if(Object.keys(this.selectedFile).length == 1) {
                this.selectedFile = [];
            }
            this.selectedFile = event.target.files;
		},
        clearFileInput() {
			this.$refs.userimg.value = "";
		},
    }
}
</script>
