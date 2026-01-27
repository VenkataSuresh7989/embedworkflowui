<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title"><strong>Update Build Information</strong></h6>
			<div>
				<button class="btn cus_btn" @click="modalDismiss">
					<font-awesome-icon :icon="['fas', 'xmark']" /> </button>
			</div>
		</ModalHeader>
		<ModalBody>
			<div class="row">
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputEmail1" class="form-label">Version</label>
						<input type="text" class="form-control" :disabled="isDisable" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="getInfo.version" @change="handleChange($event, 'version')"> </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputBuildName" class="form-label">Build Name</label>
						<input type="text" class="form-control" :disabled="isDisable" id="exampleInputBuildName" aria-describedby="emailHelp" v-model="getInfo.build_name" @change="handleChange($event, 'build_name')"> </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputBuildType" class="form-label">Build Type</label>
						<select class="form-select" aria-label="Default select example" :disabled="isDisable" v-model="getInfo.build_type" @change="handleChange($event, 'build_type')">
							<option value="" selected>-- select build type --</option>
							<option value="0">Test Build</option>
							<option value="1">Release Build</option>
						</select>
					</div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputBuildOption" class="form-label">Build Option</label>
						<select class="form-select" aria-label="Default select example" :disabled="isDisable" v-model="getInfo.build_option" @change="handleChange($event, 'build_option')">
							<option value="" selected>-- select build option --</option>
							<option value="0">Web</option>
							<option value="1">Mobile</option>
						</select>
					</div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputBuildPath" class="form-label"> Build Path</label>
						<input type="text" class="form-control" id="exampleInputBuildPath" :disabled="isDisable" aria-describedby="emailHelp" v-model="getInfo.build_path" @change="handleChange($event, 'build_path')"> </div>
				</div>				
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputFixedList" class="form-label">Fixed List</label>
						<textarea type="text" class="form-control" id="exampleInputFixedList" :disabled="isDisable" aria-describedby="emailHelp" v-model="getInfo.fixed_list" @change="handleChange($event, 'fixed_list')"></textarea>
					</div>
				</div>
        <div class="col-sm-6">
          <div class="mb-3">
            <label for="exampleInputStatus" class="form-label">Status</label>
            <select class="form-select" aria-label="Default select example" v-model="getInfo.build_status" @change="handleChange($event, 'build_status')">
              <option value="" selected>-- select status --</option>
              <option value="0">In Progress</option>
              <option value="1">Fail</option>
              <option value="2">Success</option>
            </select>
          </div>
        </div>
        <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputRemark" class="form-label">Remark</label>
						<textarea type="text" class="form-control" id="exampleInputRemark" aria-describedby="emailHelp" v-model="getInfo.remark" @change="handleChange($event, 'remark')"></textarea>
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
import { chgDataFormat, getSelIdxInfo, getUserRole } from "@/assets/script/common";
import { eventBus } from "../../main";
import {getLabelInfo, getOrgInfo, fetchAPIInfo, getUser } from "@/assets/script/common";

export default {
  name: "BuildInfoEdit",
  components: { Modal, ModalHeader, ModalBody, ModalFooter },
  data() {
    return {
      nodeName: "",
      getInfo: {},
      orgInfo: {},
      chgData: {},
    };
  },
  mixins: [ModalMixin],
  props: {
    nameValues: Object,
    idx: Number,
  },
  created() {
    this.getInfo = {};
    this.getInfo = this.$props["nameValues"];
  },
  computed: {
    isDisable: function() {
      let roleIdx = getUserRole();
      return (roleIdx == 3) ? true : false;
    },
  },
  methods: {
    /* -------------------------------------------  Close Modal ----------------------------------------------- */
    modalDismiss: function () {
      eventBus.$emit("getInfo", "build", getOrgInfo("build_info"));
      getSelIdxInfo("DELETE");
      this.dismiss("Modal dismissed");
    },
    handleChange: function (event, key) {
      this.chgData[key] = { key: key, value: event.target.value };
    },
    /* -------------------------------------  Update Changed Build Information --------------------------------- */
    async updateBuild() {
      let chgDataInfo = {};
      let orgInfo = getSelIdxInfo("GET");
      
      let userInfo = getUser();
      this.chgData["updated_by"] = { key: "updated_by", value: userInfo["username"] };

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
      
      if (chgArr.length == 1 && (Object.keys(this.chgData).length == 1)) {
        this.chgData = {};
        this.modalDismiss();
      } else {
        const response = await fetchAPIInfo("post", "/updatebuild?id=" +  this.$props["nameValues"]["id"] + "&data=" + encodeURIComponent(JSON.stringify(chgArr)));
        if (response.status == 200) {
          this.modalDismiss();
          eventBus.$emit("evtGetBuildInfo");
        } else {
          ModalService.open(InformationMessage, [{ msgTitle: "Information Message", msgInfo: response.data }]);
        }
      }
    },
  },
};
</script>
