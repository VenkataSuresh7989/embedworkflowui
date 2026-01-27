<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title"><strong>Edit Product Information </strong></h6>
			<div>
				<button class="btn cus_btn" @click="modalDismiss">
					<font-awesome-icon :icon="['fas', 'xmark']" />
				</button>
			</div>
		</ModalHeader>
		<ModalBody>
			<div class="row">
                <div class="mb-2">
					<label for="exampleProjectEditName" class="form-label">Product Name</label>
					<input type="text" class="form-control" id="exampleProjectEditName" v-model="getInfo.name" aria-describedby="emailHelp" @change="handleChange($event,'name')"/>
				</div>
				<div class="mb-2">
					<label for="exampleEditFrontend" class="form-label">Frontend</label>
					<input type="text" class="form-control" id="exampleEditFrontend" v-model="getInfo.frontend" aria-describedby="emailHelp" @change="handleChange($event,'frontend')"/>
				</div>
				<div class="mb-2">
					<label for="exampleEditBackend" class="form-label">Backend</label>
					<input type="text" class="form-control" id="exampleEditBackend" v-model="getInfo.backend" aria-describedby="emailHelp" @change="handleChange($event,'backend')"/>
				</div>
				<div class="mb-2">
					<label for="exampleEditDatabse" class="form-label">Database</label>
					<input type="text" class="form-control" id="exampleEditDatabse" v-model="getInfo.database" aria-describedby="emailHelp" @change="handleChange($event,'database')"/>
				</div>
				<div class="mb-2">
					<label for="exampleEditframework" class="form-label">IDE</label>
					<input type="text" class="form-control" id="exampleEditframework" v-model="getInfo.framework" aria-describedby="emailHelp" @change="handleChange($event,'framework')"/>
				</div>
			</div>
		</ModalBody>
		<ModalFooter>
			<div>
				<button class="btn cus_btn" @click="btnUpdateProduct">Update Product</button>
				<button class="btn cus_btn ml-2 btn-danger" @click="modalDismiss">Close</button>
			</div>
		</ModalFooter>
	</Modal>
</template>
<script>
import ModalService from "../../modules/modals/services/modalsubchild.service";
import InformationMessage from "../../views/modals/InformationMessage.vue";
import Modal from "../../modules/modals/components/ModalScreen.vue";
import ModalHeader from "../../modules/modals/components/ModalHeader.vue";
import ModalBody from "../../modules/modals/components/ModalBody.vue";
import ModalFooter from "../../modules/modals/components/ModalFooter.vue";
import ModalMixin from "../../modules/modals/mixins/ModalMixin";
import { chgDataFormat, fetchAPIInfo, getLabelInfo, getSelIdxInfo } from "@/assets/script/common";
import { eventBus } from "@/main";

export default {
    name: "ProductInfoEdit",
    data() {
        return {
            getInfo: {},
            chgData: {},
			selectedFile: [],
        }
    },
    props: {
        nameValues: Object,
		idx: Number
    },
    mixins: [ModalMixin],
    components: { Modal, ModalHeader, ModalBody, ModalFooter },
    created() {
        this.getInfo = this.$props["nameValues"];
    },
    methods: {
        modalDismiss: function () {
            this.chgData = {};
			getSelIdxInfo("DELETE");
            this.dismiss("Modal dismissed");
        },
		handleChange: function(event,key) {
			this.chgData[key] = {"key" : key, "value" : event.target.value};
		},
		async btnUpdateProduct() {
			let chgDataInfo = {};
			let orgInfo = getSelIdxInfo("GET");
			for (let chgInfo in this.chgData) {
				if (this.chgData[chgInfo].value.trim() == "") {
					console.log("chgInfo : ", chgInfo);
					ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: getLabelInfo(chgInfo) + " cannot be empty."}]);
					return;
				} else {
					if(orgInfo[chgInfo] != this.chgData[chgInfo].value) {
						chgDataInfo[chgInfo] = { key: chgInfo, value: this.chgData[chgInfo].value };
					}
				}
			}
			if(Object.keys(chgDataInfo).length > 0) {
				let chgArr = chgDataFormat(chgDataInfo);
				if (chgArr.length == 0 ) { 
					this.modalDismiss();
				}
				else {
					let response = await fetchAPIInfo("post", "/updateproductinfo?id=" +  this.$props["idx"].toString() + "&data=" + encodeURIComponent(JSON.stringify(chgArr)));
					if (response.status == 200) {
						this.modalDismiss();
						eventBus.$emit("evtGetProductInfo");
					} else {
						ModalService.open(InformationMessage, [{ msgTitle: "Information Message", msgInfo: response.data }]);
					}
				}
			}
			// else
			// 	this.modalDismiss();

		}
    }
}
</script>
