<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title"><strong>Update Firmware Version Information</strong></h6>
			<div>
				<button class="btn cus_btn" @click="modalDismiss">
					<font-awesome-icon :icon="['fas', 'xmark']" /> </button>
			</div>
		</ModalHeader>
		<ModalBody>
			<div class="row">
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputEmail1" class="form-label">XPR</label>
						<input type="text" class="form-control" :disabled="isDisable" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="getInfo.xpr" @change="handleChange($event, 'xpr')"> </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputBuildName" class="form-label">MB-BLE</label>
						<input type="text" class="form-control" :disabled="isDisable" id="exampleInputBuildName" aria-describedby="emailHelp" v-model="getInfo.mb_ble" @change="handleChange($event, 'mb_ble')"> </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputEmail1" class="form-label">Flex Max</label>
						<input type="text" class="form-control" :disabled="isDisable" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="getInfo.flex_max" @change="handleChange($event, 'flex_max')"> </div>
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
import {getLabelInfo, getOrgInfo, fetchAPIInfo } from "@/assets/script/common";

export default {
  name: "FirmwaresInfoEdit",
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
    console.log("this.getInfo", this.getInfo);    
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
      eventBus.$emit("getInfo", "build", getOrgInfo("build_info"), "Build Information");
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
          eventBus.$emit("evtGetVersionInfo");
        } else {
          ModalService.open(InformationMessage, [{ msgTitle: "Information Message", msgInfo: response.data }]);
        }
      }
    },
  },
};
</script>
