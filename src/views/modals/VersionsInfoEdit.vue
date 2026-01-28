<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title"><strong>Update Version Information</strong></h6>
			<div>
				<button class="btn cus_btn" @click="modalDismiss">
					<font-awesome-icon :icon="['fas', 'xmark']" /> </button>
			</div>
		</ModalHeader>
		<ModalBody>
			<div class="row">
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputopti_server" class="form-label">Opti-Server</label>
						<input type="text" class="form-control" :disabled="isDisable" id="exampleInputopti_server" aria-describedby="emailHelp" maxlength="10" inputmode="decimal" v-model="getInfo.opti_server" @change="handleChange($event, 'opti_server')"> </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputcada" class="form-label">CADA</label>
						<input type="text" class="form-control" :disabled="isDisable" id="exampleInputcada" aria-describedby="emailHelp" maxlength="10" inputmode="decimal" v-model="getInfo.cada" @change="handleChange($event, 'cada')"> </div>
				</div>
        <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputamp_android" class="form-label">Amplifier Android</label>
						<input type="text" class="form-control" :disabled="isDisable" id="exampleInputamp_android" aria-describedby="emailHelp" maxlength="10" inputmode="decimal" v-model="getInfo.amp_android" @change="handleChange($event, 'amp_android')"> </div>
				</div>
				<div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputamp_ios" class="form-label">Amplifier iOS</label>
						<input type="text" class="form-control" :disabled="isDisable" id="exampleInputamp_ios" aria-describedby="emailHelp" maxlength="10" inputmode="decimal" v-model="getInfo.amp_ios" @change="handleChange($event, 'amp_ios')"> </div>
				</div>
        <div class="col-sm-6">
					<div class="mb-3">
						<label for="exampleInputmsam" class="form-label">MSAM</label>
						<input type="text" class="form-control" :disabled="isDisable" id="exampleInputmsam" aria-describedby="emailHelp" maxlength="10" inputmode="decimal" v-model="getInfo.msam" @change="handleChange($event, 'msam')"> </div>
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
  name: "VersionsInfoEdit",
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
      console.log(event, key);      
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
