<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title"><strong>Update Information</strong></h6>
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
						<label for="exampleInputLabel" class="form-label">Label</label>
                        <input type="text" class="form-control" id="exampleInputLabel" v-model="getTaskInfo.label" @change="handleChange($event,'label')" aria-describedby="emailHelp">
                    </div>
                    <div class="mb-3">
						<label for="exampleInputValue" class="form-label">Value</label>
                        <input type="text" class="form-control" id="exampleInputValue" v-model="getTaskInfo.value" @change="handleChange($event,'value')" aria-describedby="emailHelp">
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
import { getOrgInfo, getSelIdxInfo, chgDataFormat, fetchAPIInfo } from "@/assets/script/common"; // chgDataFormat, getLabelInfo, fetchAPIInfo, 
import { eventBus } from "@/main";

export default {
    name: "MsamToolEdit",
    mixins: [ModalMixin],
    props: {
        nameValues: Object,
        idx: Number,
    },    
    data(){
        return {
            getTaskInfo: {},
			chgData: {},
			orgImgInfo: []
        }
    },
    components: { Modal, ModalHeader, ModalBody, ModalFooter },
    created() {
        this.getTaskInfo = this.$props.nameValues;
		this.orgImgInfo = getSelIdxInfo("GET");
        console.log("this.$props.nameValues", this.$props.nameValues);
        
    },
    methods: {
		/* -------------------------------------------  Close Modal ----------------------------------------------- */
        modalDismiss: function () {
            eventBus.$emit("getInfo", "task", getOrgInfo("task_info"), "Task Information");
			getSelIdxInfo("DELETE");
            this.dismiss("Modal dismissed");
        },
		handleChange: function(event,key) {
			this.chgData[key] = {"key" : key, "value" : event.target.value};
		},
		/* -------------------------------------  Update Changed Task Information --------------------------------- */
		async btnClick() {
            let chgDataInfo = {};
			let orgInfo = getSelIdxInfo("GET");
            for (let chgInfo in this.chgData) {
				if (this.chgData[chgInfo].value.trim() == "") {
                    let msgTitle = (chgInfo == "label") ? "Label" : (chgInfo == "value") ? "Value" : chgInfo;
					ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: msgTitle + " cannot be empty."}]);
					return;
				} else {
					if(orgInfo[chgInfo] != this.chgData[chgInfo].value) {
						chgDataInfo[chgInfo] = { key: chgInfo, value: this.chgData[chgInfo].value };
					}
				}
			}
			let chgArr = chgDataFormat(chgDataInfo);
            if ((Object.keys(chgArr[0]).length == 0)) {
				this.chgData = {};
				this.modalDismiss();
			} else {
                let response = await fetchAPIInfo("put", "/updatetoolheaderitems?header_id=" + this.$props["nameValues"]["id"] + "&data=" + encodeURIComponent(JSON.stringify(chgArr)));
				if (response.status == 200) {
					this.modalDismiss();
					eventBus.$emit("evtGetMsamInfo");
				} else {
					ModalService.open(InformationMessage, [{ msgTitle: "Information Message", msgInfo: response.data }]);
				}
            }
		},
    }
}
</script>