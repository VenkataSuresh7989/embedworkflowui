<template>
	<div>
        <!-------------------------------------- Create New Build -------------------------------------------------------------------------------------->
		<div class="container pt-3" v-if="isDisable">
            <div class="row">
                <!-- <div class="col-sm-12 text-center">
                    <h3 class="main-heading"><strong>Create New Build</strong></h3>
                </div> -->
                <div class="text-center mb-4">
					<button class="btn cus_btn" @click="btnNewBuild"><font-awesome-icon :icon="['fas', 'plus']" /> Create New Build</button>
				</div>
                <div class="cardWrap p-4 mb-3" v-if="isCheck">
                    <form @submit.prevent>
                    <div class="row">                        
                        <div class="col-sm-3">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Version</label>
                                <input type="text" class="form-control" maxlength="8" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="txtVersion">
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Build Name</label>
                                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="txtBuildName">
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Build Type</label>
                                <select class="form-select" aria-label="Default select example" v-model="ddlBuildType">
                                    <option value="" selected>-- select build type --</option>
                                    <option value="0">Test Build</option>
                                    <option value="1">Release Build</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Build Option</label>
                                <select class="form-select" aria-label="Default select example" v-model="ddlBuildOption">
                                    <option value="" selected>-- select build option --</option>
                                    <option value="0">Web</option>
                                    <option value="1">Mobile</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label"> Build Path</label>
                                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="txtBuildPath">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Fixed List</label>
                                <textarea type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="txtFixedList"></textarea>
                            </div>
                        </div>
                        <div class="col-sm-12 text-center">
                            <button type="submit" class="btn cus_btn" @click="btnAddBuild">Add Build</button>
                        </div>
                    </div>
                </form>
                </div>                
            </div>
			
		</div>
        <!-------------------------------------- Build Information -------------------------------------------------------------------------------->
		<div>
			<DataTable  :getFieldsInfo="getFieldsInfo"  :txtTitle="'Build Information'"/>
        </div>
	</div>
</template>
<script>
import ModalService from "../modules/modals/services/modal.service";
import InformationMessage from "../views/modals/InformationMessage.vue";
import { chgDataFormat, fetchAPIInfo, getLabelInfo, getUser, getUserRole } from "@/assets/script/common";
import DataTable from '../components/DataTable.vue';
import { eventBus } from '@/main';
export default {
    name: "BuildsInfo",
    data() {
        return {
            getFieldsInfo : [
                { key: "version", label: "Version", sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
                { key: "build_name", label: "Build Name", sortable: true, sortDirection: "desc" },
                { key: "build_type", label: "Build  Type", formatter: (value) => { return this.getBuildType(value) }, sortable: true, sortByFormatted: true, filterByFormatted: true },
                { key: "build_option", label: "Build Option", formatter: (value) => { return this.getBuildOption(value) }, sortable: true, sortByFormatted: true,filterByFormatted: true, class: "text-center" },
                { key: "build_path", label: "Build Path" },
                // { key: "build_status", label: "Build Status", formatter: (value) => { return this.getBuildStatus(value) }, sortable: true, sortByFormatted: true,filterByFormatted: true, },
                { key: 'actions', label: 'Actions' }
            ],
            txtVersion: "",
            txtBuildName: "",
            ddlBuildType: "",
            ddlBuildOption: "",
            txtBuildPath: "",
            ddlStatus: "",
            txtFixedList: "",
            isCheck: false
        }
    },
    components: {
        DataTable
    },
    created() {
        this.clearData();
        this.getBuildInfo();
    },
    computed: {
        isDisable: function() {
            let roleIdx = getUserRole();
            return (roleIdx != 2) ? false : true;
        }
    },
    mounted() {
        eventBus.$on("btnRefresh",()=> {
            this.getBuildInfo();
        });
        eventBus.$on("evtGetBuildInfo",()=> {
            this.getBuildInfo();
        });
        eventBus.$on("getInfo", () => {
            this.clearData();
        });
        eventBus.$on("isRemoveBuild", (idx) => {
            this.removeBuild(idx);
        });
    },
    destroyed() {
        eventBus.$off("btnRefresh");
        eventBus.$off("evtGetBuildInfo");
        eventBus.$off("getInfo");
        eventBus.$off("isRemoveBuild");
    },
    methods: {
        btnNewBuild: function() {
            this.isCheck = !this.isCheck;
        },
        /* ------------------------------------------ Get User Role  ------------------------------------------ */
        getUserRole: function(role) {
            return (role == '0') ? 'SuperAdmin' : (role == '1') ? 'Admin' : (role == '2') ? 'Manager' : 'Employee';
        },
        /* ------------------------------------------ Get User Type  ------------------------------------------ */
        getUserType: function(role) {
            return (role == '0') ? 'SoftwareEngineer' : (role == '1') ? 'FullStackDeveloper' : (role == '2') ? 'FrontEndDeveloper' : (role == '3') ? 'BackEndDeveloper' :'Tester';
        },
        /* ------------------------------------------ Get Build Type  ----------------------------------------- */
        getBuildType: function(type) {
            return (type == '0') ? 'Test Build' : 'Release Build';
        },
        /* ------------------------------------------ Get Build Option  --------------------------------------- */
        getBuildOption: function(opt) {
            return (opt == '0') ? 'Web' : 'Mobile';
        },
        /* ------------------------------------------ Get Build Status  --------------------------------------- */
        getBuildStatus: function(status) {
            return (status == '0') ? 'InProgress' : (status == '1') ? 'Fail' : 'Success';
        },
        /* ------------------------------------------ Get Build Info  ----------------------------------------- */
        async getBuildInfo() {            
            let product_idx= JSON.parse(localStorage.getItem("product_idx" + sessionStorage.getItem("access_token").toString()));
            let resp = await fetchAPIInfo('get', '/getallbuildinfo?prod_idx=' + product_idx['prod_idx']);
            if(resp.status == 200) {
                localStorage.setItem("build_info" + sessionStorage.getItem("access_token").toString(),JSON.stringify(resp.data));
                eventBus.$emit("getInfo", "build", resp.data, "Build Information");
            }
        },
        /* ------------------------------------------  Create New Build ----------------------------------------*/        
        async btnAddBuild() {
            /* ---------------------------------- Changed data Variable Array --------------------------------- */
            let chgArr = ["txtVersion", "txtBuildName", "ddlBuildType", "ddlBuildOption", "txtBuildPath", "txtFixedList"];

            /* ---------------------------------- Dynamic GET variable Array ---------------------------------- */
            let chgKeyArr = ["version", "build_name", "build_type", "build_option", "build_path", "fixed_list"];

            let chgData = {};
            for (let chgKey in chgArr) {
                if (this[chgArr[chgKey]] == "") {
                    chgData = {};
                    ModalService.open(InformationMessage, [{ msgTitle: "Information Message", msgInfo: getLabelInfo(chgArr[chgKey]) + " cannot be empty." }]);
                    return;
                } else {
                    chgData[chgKeyArr[chgKey]] = {key: chgKeyArr[chgKey], value: this[chgArr[chgKey]]};
                }
            }

            let userInfo = getUser();
            chgData["created_by"] = { key: "created_by", value: userInfo["username"] };
            let resp = chgDataFormat(chgData);
            let product_idx= JSON.parse(localStorage.getItem("product_idx" + sessionStorage.getItem("access_token").toString()));
            const response = await fetchAPIInfo("post", "/createbuild?prod_id=" + product_idx['prod_idx'] + "&data=" + encodeURIComponent(JSON.stringify(resp)));
            if (response.status == 200) {
                this.isCheck = false;
                this.clearData();
                eventBus.$emit("evtGetBuildInfo");
            }
            else {
                ModalService.open(InformationMessage, [{ msgTitle: "Information Message", msgInfo: response.data }]);
            }
        },
        /* ----------------------------------------- Clear the input fields ----------------------------------- */
        clearData: function () {
            this.txtVersion = "";
            this.txtBuildName = "";
            this.ddlBuildType = "";
            this.ddlBuildOption = "";
            this.txtBuildPath = "";
            this.ddlStatus = "";
            this.txtFixedList = "";
        },
        /* ----------------------------------------- Remove Selected Build ------------------------------------ */
        async removeBuild(idx) {
            let resp = await fetchAPIInfo('post', '/deletebuild?id=' + parseInt(idx));
			if(resp.status == 200) {
				this.getBuildInfo();
			}
        }
    }
}
</script>

