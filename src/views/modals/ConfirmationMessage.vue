<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title">{{ title }}</h6>
			<div>
				<button class="btn cus_btn" @click="confirmNoModalEvent">
					<font-awesome-icon :icon="['fas', 'xmark']" /></button>
			</div>
		</ModalHeader>
		<ModalBody>
			<p class="mb-0"> <span class="text-warning" style="font-size: 30px;position: absolute;top: 50%;transform:translateY(-50%);line-height: normal; height: 35px;">
        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
        </span> <span v-html="msgInfo" style="padding-left:38px"></span>
      </p>
		</ModalBody>
		<ModalFooter>
			<button v-on:click="confirmYesModalEvent" class="btn cus_btn">Yes</button>
			<button @click="confirmNoModalEvent" class="btn cus_btn btn-danger">No</button>
		</ModalFooter>
	</Modal>
</template>

<script>
import Modal from "../../modules/modals/components/ModalScreen.vue";
import ModalHeader from "../../modules/modals/components/ModalHeader.vue";
import ModalFooter from "../../modules/modals/components/ModalFooter.vue";
import ModalBody from "../../modules/modals/components/ModalBody.vue";
import ModalMixin from "../../modules/modals/mixins/ModalMixin";
import { eventBus } from "../../main";

export default {
  name: "ConfirmationMessage",
  components: { Modal, ModalHeader, ModalBody, ModalFooter },
  mixins: [ModalMixin],
  data() {
    return {
      title: "Opti-Trace Server",
    };
  },
  mounted() {
    if (this.msgTitle == "")
      this.title = "Embed Work Flow";
    else
      this.title = this.msgTitle;
  },
  methods: {
    async confirmYesModalEvent() {
      if (this.msgInfo == "Are you sure you want to Logout?") {
        this.dismiss("Modal dismissed");
        eventBus.$emit("isSignout");
      }
      else if (this.msgInfo == "Are you sure you want to remove product?") {
        this.dismiss("Modal dismissed");
        eventBus.$emit("isRemoveProduct", this.nameValues[0]);
      }
      else if (this.msgInfo == "Are you sure you want to remove task?") {
        this.dismiss("Modal dismissed");
        eventBus.$emit("isRemoveTask", this.nameValues[0]);
      }
      else if (this.msgInfo == "Are you sure you want to remove build?") {
        this.dismiss("Modal dismissed");
        eventBus.$emit("isRemoveBuild", this.nameValues[0]);
      }
      else if (this.msgInfo == "Are you sure you want to remove selected user?") {
        this.dismiss("Modal dismissed");
        eventBus.$emit("isRemoveUser", this.nameValues[0]);
      }      
    },
    confirmNoModalEvent: function () {
      this.dismiss("Modal dismissed");
      eventBus.$emit("isCancelModal");
    },
  },
};
</script>
