<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title"><strong>Add New User</strong></h6>
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
						<label for="exampleUserId" class="form-label">Employee Id</label>
						<input type="text" class="form-control" id="exampleUserId" maxlength="9" v-model="emp_id" aria-describedby="emp_id" @change="handleChange($event,'emp_id')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleUserEditName" class="form-label">Username</label>
						<input type="text" class="form-control" id="exampleUserEditName" v-model="username" aria-describedby="username" @change="handleChange($event,'username')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleUserEditPwd" class="form-label">Password</label>
						<input type="text" class="form-control" id="exampleUserEditPwd" v-model="password" maxlength="12" aria-describedby="password" @change="handleChange($event,'password')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleUserEmailId" class="form-label">Email</label>
						<input type="email" class="form-control" id="exampleUserEmailId" v-model="email" aria-describedby="email" @change="handleChange($event,'email')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label class="form-label">User Role</label>
						<select class="form-select" aria-label="Default select example" v-model="user_role" @change="handleChange($event,'user_role')">
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
						<select class="form-select" aria-label="Default select example" v-model="job_role" @change="handleChange($event,'job_role')">
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
						<label for="exampleUserEditPhn" class="form-label">Phone No</label>
						<input type="text" class="form-control" id="exampleUserEditPhn" maxlength="10" v-on:keyup="isNumeric($event)" v-model="phoneno" aria-describedby="phoneno" @change="handleChange($event,'phoneno')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleUSerEditAddress" class="form-label">Address</label>
						<textarea class="form-control" id="exampleUSerEditAddress" v-model="address" aria-describedby="address" @change="handleChange($event,'address')"></textarea>
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleUserEditQualf" class="form-label">Qualification</label>
						<input type="text" class="form-control" id="exampleUserEditQualf" v-model="qualification" aria-describedby="qualification" @change="handleChange($event,'qualification')">
                    </div>
				</div>
                <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleUserEditSkill" class="form-label">Skills</label>
						<input type="text" class="form-control" id="exampleUserEditSkill" v-model="skills" aria-describedby="skills" @change="handleChange($event,'skills')">
                    </div>
				</div>
			</div>
		</ModalBody>
		<ModalFooter>
			<div>
				<button class="btn cus_btn" @click="btnAddNewUser">Add User</button>
				<button class="btn cus_btn ml-2 btn-danger"  @click="modalDismiss">Close</button>
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
import { chgDataFormat, fetchAPIInfo, getLabelInfo, onlyNumbers } from "@/assets/script/common";
import { eventBus } from "@/main";
export default {
    name: "AddNewUser",
    data() {
        return {
            emp_id: "",
            username: "",
            password: "",
            email: "",
            user_role: "",
            job_role: "",
            phoneno: "",
            address: "",
            qualification: "",
            skills: "",
            chgData: {},
            selectedFile: [],
        }
    },
    mixins: [ModalMixin],
    components: { Modal, ModalHeader, ModalBody, ModalFooter },
    methods: {
        modalDismiss: function () {
            this.chgData = {};
            this.dismiss("Modal dismissed");
        },
        isNumeric: function (event) {   
			let resVal = onlyNumbers(event.target.value.toString());       
			event.target.value = resVal;  
		},
        handleChange: function(event,key) {
            if (event.target.value == "") {
                if (key in this.chgData) {
                    delete this.chgData[key];
                }
            }
            else if (event.target.value != "") {
                this.chgData[key.toString()] = {"key" : key.toString(), "value" : event.target.value};
            }
        },
        async btnAddNewUser() {            
            let textFieldArr = ["emp_id", "username", "password", "email", "user_role", "job_role", "phoneno", "address", "qualification", "skills"];
            
            for (let chgInfo in textFieldArr) {
                if (this[textFieldArr[chgInfo]].trim() == "") {
                    ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: getLabelInfo(textFieldArr[chgInfo]) + " cannot be empty."}]);
                    return;
                }
                else {
                    let errMsg = "";
                    if(textFieldArr[chgInfo] == "emp_id"){
                        if(this[textFieldArr[chgInfo]].trim().length != 8){
                            errMsg = "Emp Id length must be 8.";
                        }
                    }
                    else if(textFieldArr[chgInfo] == "phoneno"){
                        if(this[textFieldArr[chgInfo]].trim().length != 10){
                            errMsg = "Phone Number length must be 10.";
                        }
                    }
                    else if(textFieldArr[chgInfo] == "email") {
                        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if(!emailRegex.test(this[textFieldArr[chgInfo]])) {
                            ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: "Please enter valid email."}]);
                            return;
                        }                        
                    }
                    if(errMsg != "") {
                        ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: errMsg}]);
                        return;
                    }
                }
            }
            
            if(this.selectedFile.length == 0)
            {
                ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: "Photo cannot be empty."}]);
                return;
            }
            
            let formData = new FormData();
            formData.append("files", this.selectedFile[0]);
             
            const response = await fetchAPIInfo("post", "/register?data=" + JSON.stringify(chgDataFormat(this.chgData)), formData, true);
            if(response.status == 200) {
                this.modalDismiss();
                eventBus.$emit("btnRefresh");
            }
        },
        getImgUrl: function(file) {
			return (file.length == 0) ? this.$store.state.getImg : URL.createObjectURL(file[0]);
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
