<template>
	<div>
		<div class="container pt-3" v-if="isDisable">
			<!--------------------------------------------------------------- Create New Task ------------------------------------------------------->
			<div class="row">
				<!-- <div class="col-sm-12 text-center">
					<h3 class="main-heading"><strong>Create New Task</strong></h3>
				</div>	 -->
				<div class="text-center mb-4">
					<button class="btn cus_btn" @click="btnNewTask"><font-awesome-icon :icon="['fas', 'plus']" /> Create New Task</button>
				</div>
				<div class="cardWrap p-4 mb-3" v-if="isCheck">
					<form @submit.prevent>
						<div class="row">
							
							<div class="col-sm-6">
								<div class="mb-2">
									<label for="exampleInputEmail1" class="form-label">Version</label>
									<input type="text" class="form-control" id="exampleInputEmail1" maxlength="8" v-model="txtVersion" aria-describedby="emailHelp" onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode === 46">
								</div>
							</div>
							<div class="col-sm-6">
								<div class="mb-2">
									<label for="exampleInputEmail1" class="form-label">Assigned To</label>
									<select class="form-select" aria-label="Default select example" v-model="ddlUserSel">
										<option value="" selected disabled>-- select user --</option>
										<option :value="data.emp_id" v-for="(data,idx) in getUserInfo" :key="idx">{{ data.username }}</option>
									</select>
								</div>
							</div>
							<div class="col-sm-12">
								<div class="mb-2">
									<label for="exampleInputEmail1" class="form-label">Task</label>
									<textarea class="form-control" v-model="txtTask" id="exampleInputEmail1" rows="4" aria-describedby="emailHelp"></textarea>
								</div>
							</div>	
						</div>			
						<div class="d-flex">
							<div>
								<div class="customUpload">
									<input type="file" name="files" ref="fileInput" accept=".jpg, .png" multiple @change="handleFileChange" />
									<span><font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" /></span>
								</div>
							</div>	
							<div  style="margin-left: 15px;" v-if="(Object.keys(selectedFiles).length) > 0">
								<div class="uploadImage">
									<ul v-for="(data, idx) in selectedFiles" :key="idx">
										<li>
											<span class=""><img :src="getImgUrl(data)" alt="" /></span>
											<button class="btn" @click="removeSelectedFile(data.name)"><span><font-awesome-icon :icon="['fas', 'xmark']" /></span> </button>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-12 text-center">
								<button type="submit" class="btn cus_btn" @click="btnAddTask">Add Task</button>
							</div>
						</div>	
					</form>
				</div>
			</div>
		</div>
		<!----------------------------------------------------------------- GET Task Information ---------------------------------------------------->
		<div>
			<DataTable :getFieldsInfo="getFieldsInfo" :txtTitle="'Task Information'"/>
        </div>
	</div>
</template>

<script>
import ModalService from "../modules/modals/services/modalchild.service";
import InformationMessage from "../views/modals/InformationMessage.vue";
import DataTable from '../components/DataTable.vue';
import { fetchAPIInfo, getLabelInfo, chgDataFormat, getUser, getAllUserInfo, getUserRole } from '@/assets/script/common';
import { eventBus } from "@/main";

export default {
    name: "TasksInfo",
    data() {
        return {
            getUserInfo: [],
            txtVersion: "",
            ddlUserSel: "",
            txtTask: "",
			getFieldsInfo : [
				{ key: "version", label: "Version", sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
                { key: "assigned_by", label: "Assigned By", formatter: (value) => { return this.getAssignEmpName(value) }, sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
				{ key: "emp_id", label: "Assigned To", formatter: (value) => { return this.getEmpName(value) }, sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },				
                { key: "task", label: "Task", sortable: true, sortDirection: "desc" },
                { key: "task_progress", label: "Status", formatter: (value) => { return this.getBuildStatus(value) }, sortable: true, sortByFormatted: true,filterByFormatted: true, class: "text-center" },
                { key: 'images', label: 'Images' },
				{ key: 'actions', label: 'Actions' }
            ],
			selectedFiles: [],
			isCheck: false
        }
    },
	components: {
		DataTable
	},
	computed: {
		isDisable: function() {
			let roleIdx = getUserRole();
			return ((roleIdx == 0) || (roleIdx == 1)) ? false : true;
		}
	},
    created() {
        this.getAllUserData();
		this.getTaskInfo();
    },
	mounted() {
		eventBus.$on("btnRefresh",()=>{
			this.getTaskInfo();
		});
		eventBus.$on("evtGetTaskInfo",()=> {
            this.getTaskInfo();
        });
		eventBus.$on("isRemoveTask",(idx)=> {
            this.removeTask(idx);
        });
	},
	destroyed() {
		eventBus.$off("btnRefresh");
		eventBus.$off("evtGetTaskInfo");
		eventBus.$off("isRemoveTask");
	},
    methods: {
		btnNewTask: function() {
			this.isCheck = !this.isCheck;
		},
		/* -------------------------------------------  Clear Task ----------------------------------------------- */
		clearTaskInfo: function() {
			this.txtVersion = "";
			this.ddlUserSel = "";
			this.txtTask = "";
		},
		getAssignEmpName: function(assignBy) {
			let resp = getAllUserInfo();
			if(resp != "") {
				let user = resp.find(user => user.username === assignBy);
				return assignBy + " (" + user.emp_id + ")";
			}
		},
		/* -------------------------------------------  Get Employee Name ---------------------------------------- */
		getEmpName: function(getName) {
			let resp = getAllUserInfo();
			if(resp != "") {
				let user = resp.find(user => user.emp_id === getName);
				return user.username + " (" + getName + ")";
			}
		},
		/* -------------------------------------------  Get Build Status ----------------------------------------- */
		getBuildStatus: function(status) {
            return (status == '0') ? 'InProgress' : (status == '1') ? 'Pending' : 'Completed';
        },
		/* -------------------------------------------  Get User Info -------------------------------------------- */
        async getAllUserData() {
            let response = await fetchAPIInfo("get", "/getallempdata");
            if(response) {
				response = response.filter((item) => !["superadmin", "admin"].includes(item.username));
                this.getUserInfo = response;
				// this.getUserInfo = response.filter(item => item.emp_id !== getUser()['emp_id']);
            }
        },
		/* -----------------------------------------------  Add New Task ----------------------------------------- */
        async btnAddTask() {
			let fieldArr = ["txtVersion", "ddlUserSel", "txtTask"];
			let chgData = {};

			let userIdx = getUser();
			userIdx = userIdx["username"];

			let formData = new FormData();
			if (this.selectedFiles.length > 0) {				
				this.selectedFiles.forEach((file) => formData.append("files", file));
			}
			else
				this.selectedFiles = {};

			for(let field in fieldArr) {
				if(this[fieldArr[field]].trim() == "") {
					chgData = {};
					ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: getLabelInfo(fieldArr[field]) + " cannot be empty."}]);
					return;
				}
				else {
					chgData["version"] = {"key" : "version", "value" : this.txtVersion};
					chgData["assigned_by"] = {"key" : "assigned_by", "value" : userIdx};
					chgData["task"] = {"key" : "task", "value" : this.txtTask};
				}
			}

			let product_idx= JSON.parse(localStorage.getItem("product_idx" + sessionStorage.getItem("access_token").toString()));

			let response;
			if(Object.keys(this.selectedFiles).length > 0)
				response = await fetchAPIInfo("post", "/createtask?prod_id=" + product_idx['prod_idx'] + "&emp_id=" +  this.ddlUserSel + "&data=" + encodeURIComponent(JSON.stringify(chgDataFormat(chgData))), formData, true);
			else
				response = await fetchAPIInfo("post", "/createtask?prod_id=" + product_idx['prod_idx'] + "&emp_id=" +  this.ddlUserSel + "&data=" + encodeURIComponent(JSON.stringify(chgDataFormat(chgData))));

			if(response.status == 200) {
				this.isCheck = false;
				this.selectedFiles = [];
				this.clearTaskInfo();
				this.getTaskInfo();
			}
			else {
				ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: response.data}]);
			}
        },
		/* ------------------------------------------  Get Task Info --------------------------------------------- */
		async getTaskInfo() {
			let userInfo = JSON.parse(localStorage.getItem("login_user" + sessionStorage.getItem("access_token").toString()));
			let product_idx= JSON.parse(localStorage.getItem("product_idx" + sessionStorage.getItem("access_token").toString()));
			
			if(product_idx != undefined && product_idx != null) {
				let resp;
				if(userInfo["user_role"] == 0 || userInfo["user_role"] == 1)
					resp = await fetchAPIInfo('get', '/getalltaskinfo?prod_idx=' + product_idx['prod_idx']);					
				else
					resp = await fetchAPIInfo('get', '/gettaskinfo?emp_id=' + product_idx['emp_id'] + '&assign_by=' + userInfo['username'] + '&prod_idx=' + product_idx['prod_idx']);
				if(resp) {
					localStorage.setItem("task_info" + sessionStorage.getItem("access_token").toString(),JSON.stringify(resp));
					eventBus.$emit("getInfo", "task", resp, "Task Information");
				}
			}
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
			this.$refs.fileInput.value = "";
		},
		/* ------------------------------------------ Display the selected images  ------------------------------- */
		getImgUrl: function(file) {
			return URL.createObjectURL(file);
		},
		/* ------------------------------------------ Remove selected Task  -------------------------------------- */
		async removeTask(idx) {
			let resp = await fetchAPIInfo('post', '/deletetask?id=' + parseInt(idx));
			if(resp.status == 200) {
				this.getTaskInfo();
			}
		}
    },
}
</script>