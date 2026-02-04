<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title"><strong>Update Task Information</strong></h6>
			<div>
				<button class="btn cus_btn" @click="modalDismiss">
					<font-awesome-icon :icon="['fas', 'xmark']" />
                </button>
			</div>
		</ModalHeader>
		<ModalBody>
			<div class="row">
				<div class="col-sm-12">
					<div class="mb-3">
						<label for="exampleInputEmail1" class="form-label">Version</label>
                        <input type="text" class="form-control" id="exampleInputEmail1" v-model="getTaskInfo.version" @change="handleChange($event,'version')" maxlength="8" aria-describedby="emailHelp" onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode === 46">
                    </div>
				</div>
				<div class="col-sm-12">
					<div class="mb-3">
						<label for="exampleInputEmail1" class="form-label">Assigned To</label>
						<select class="form-select" aria-label="Default select example" v-model="getTaskInfo.emp_id" @change="handleChange($event,'emp_id')">
							<option value="" selected>-- select user --</option>
							<option :value="data.emp_id" v-for="(data,idx) in getProdIdx" :key="idx">{{ data.username }}</option>
						</select>
					</div>
				</div>
				<div class="col-sm-12">
					<div class="mb-3">
						<label for="exampleInputEmail1" class="form-label">Task Progress</label>
						<select class="form-select" aria-label="Default select example" v-model="getTaskInfo.task_progress" @change="handleChange($event,'task_progress')">
							<option value="" selected>-- select task progress --</option>
							<option value="0">In Progress</option>
							<option value="1">Pending</option>
                            <option value="2">Completed</option>
						</select>
					</div>
				</div>
				<div class="col-sm-12">
					<div class="mb-3">
						<label for="exampleInputEmail1" class="form-label">Task</label>
						<textarea class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" @change="handleChange($event,'task')" v-model="getTaskInfo.task"></textarea>
                    </div>
				</div>
				<div>
					<div class="w-100">
						<div class="customUpload" style="max-width: 100%;">							
							<input type="file" name="files" ref="fileInputEdit" accept=".jpg, .png" multiple @change="handleFileChange" />
							<span class="icon"><font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" /></span>
						</div>
					</div>	
					<div>
						<div class="uploadImage">
							<ul>
								<li v-for="(data, idx) in selectedOldFiles" :key="idx">
									<span><img :src="getOldImgUrl(data)" alt="" /></span>
									<button class="btn" @click="removeOldSelectedFile(idx)"><span><font-awesome-icon :icon="['fas', 'xmark']" /></span> </button>
								</li>
								<li v-for="(data, idx) in selectedFiles" :key="idx">
									<span><img :src="getImgUrl(data)" alt="" /></span>
									<button class="btn" @click="removeSelectedFile(data.name)"><span><font-awesome-icon :icon="['fas', 'xmark']" /></span> </button>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</ModalBody>
		<ModalFooter>
			<div>
				<button class="btn cus_btn" @click="btnClick()">Update</button>
				<button class="btn cus_btn ml-2 btn-danger" @click="modalDismiss()">Close</button>
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
import { chgDataFormat, fetchAPIInfo, getFolderPath, getLabelInfo, getOrgInfo, getSelIdxInfo } from "@/assets/script/common";
import { eventBus } from "@/main";
import axios from "axios";
export default {
    name: "TaskInfoEdit",
    mixins: [ModalMixin],
    props: {
        nameValues: Object,
        idx: Number,
    },    
    data(){
        return {
            getProdIdx: [],
            getTaskInfo: {},
			chgData: {},
			selectedOldFiles: [],
			selectedFiles: [],
			orgImgInfo: []
        }
    },
    components: { Modal, ModalHeader, ModalBody, ModalFooter },
    created() {
        this.getTaskInfo = this.$props.nameValues;
        this.getAllUserData();
		this.selectedOldFiles = this.$props.nameValues.images;
		this.orgImgInfo = getSelIdxInfo("GET");
    },
    methods: {
		/* -------------------------------------------  Close Modal ----------------------------------------------- */
        modalDismiss: function () {
            eventBus.$emit("getInfo", "task", getOrgInfo("task_info"), "Task Information");
			getSelIdxInfo("DELETE");
            this.dismiss("Modal dismissed");
        },
		/* -------------------------------------  Get All User Information ---------------------------------------- */
        async getAllUserData() {
            const response = await fetchAPIInfo("get", "/getallempdata");
            if(response) {
                this.getProdIdx = response;
            }
        },
		handleChange: function(event,key) {
			this.chgData[key] = {"key" : key, "value" : event.target.value};
		},
		/* -------------------------------------  Update Changed Task Information --------------------------------- */
		async btnClick() {
			let chgDataInfo = {};
			let orgInfo = getSelIdxInfo("GET");

			// let userInfo = getUser();
			// chgDataInfo["assigned_by"] = { key: "assigned_by", value: userInfo["username"] };

			if(Object.keys(this.orgImgInfo.images).length > 0) {
				chgDataInfo["images"] = { key: "images", value: this.orgImgInfo.images };
			}

			let getOrgImgArr = JSON.parse(localStorage.getItem("task_info" + sessionStorage.getItem("access_token")));
			if(Object.keys(getOrgImgArr[this.$props.idx]["images"]).length > 0) {				
				console.log("getOrgImgArr : ", getOrgImgArr[this.$props.idx]["images"]);
				console.log("this.orgImgInfo.images : ", this.orgImgInfo.images);

				let getImgArr = getOrgImgArr[this.$props.idx]["images"];
				for(let img in  this.orgImgInfo.images)
					delete getImgArr[img];
				chgDataInfo["removed_images"] = { key: "removed_images", value: getImgArr };
			}
			
			
			let formData = new FormData();
			if(Object.keys(this.selectedFiles).length > 0) {
				this.selectedFiles.forEach((file) => formData.append("files", file));
			}
			else
				this.selectedFiles = {};

			for (let chgInfo in this.chgData) {
				if (this.chgData[chgInfo].value.trim() == "") {
					ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: getLabelInfo(chgInfo) + " cannot be empty."}]);
					return;
				} else {
					if(orgInfo[chgInfo] != this.chgData[chgInfo].value) {
						chgDataInfo[chgInfo] = { key: chgInfo, value: this.chgData[chgInfo].value };
					}
				}
			}
			let chgArr = chgDataFormat(chgDataInfo);

			if (chgArr.length == 1 && (Object.keys(Object.keys(chgArr[0]).length).length == 1)) { // this.chgData
				this.chgData = {};
				this.modalDismiss();
			} else {
				let response;
				if(Object.keys(this.selectedFiles).length > 0)
					response = await fetchAPIInfo("post", "/updatetask?id=" +  this.$props["nameValues"]["id"] + "&data=" +  this.ddlUserSel + "&data=" + encodeURIComponent(JSON.stringify(chgArr)), formData, true);
				else
					response = await fetchAPIInfo("post", "/updatetask?id=" +  this.$props["nameValues"]["id"] + "&data=" + encodeURIComponent(JSON.stringify(chgArr)));

				if (response.status == 200) {
					this.modalDismiss();
					eventBus.$emit("evtGetTaskInfo");
				} else {
					ModalService.open(InformationMessage, [{ msgTitle: "Information Message", msgInfo: response.data }]);
				}
			}			
		},
		/* -------------------------------  Dynamica folder path for dispaly Image -------------------------------- */
		getOldImgUrl: function(img) {
			let getImg = axios.defaults.baseURL + "/static/images/" + getFolderPath() + img.toString();
			return getImg;
		},
		/* ---------------------------------- Remove Previous Uploaded Image  ------------------------------------- */
		removeOldSelectedFile: function(selImg) {
			const indexToRemove = Object.keys(this.selectedOldFiles).indexOf(selImg);
			if (indexToRemove !== -1) {
				this.$delete(this.selectedOldFiles, selImg);
			}
			this.$delete(this.orgImgInfo.images, selImg);
		},
		/* ------------------------------------------ Image Upload ----------------------------------------------- */
		handleFileChange(event) {
			let newFiles = Array.from(event.target.files);

			newFiles.forEach((file) => {
				let exists = this.selectedFiles.some((data) => data.name === file.name);
				if (!exists) {
				this.selectedFiles.push(file);
				}
			});
			this.clearFileInput();
		},
		/* ------------------------------------------ Remove Selected Uploaded Image  ---------------------------- */
		removeSelectedFile(selImg) {
			this.selectedFiles = this.selectedFiles.filter(
				(item) => item.name !== selImg
			);
		},
		/* ------------------------------------------ Clear the selected image name  ----------------------------- */
		clearFileInput() {
			this.$refs.fileInputEdit.value = "";
		},
		/* ------------------------------------------ Display the selected images  -------------------------------- */
		getImgUrl: function(file) {
			return URL.createObjectURL(file);
		}
    }
}
</script>