<template>
	<Modal>
		<ModalHeader>
			<h6 class="modal-title"><strong>Employee Work Progress</strong></h6>
			<div>
				<button class="btn cus_btn" @click="modalDismiss">
					<font-awesome-icon :icon="['fas', 'xmark']" />
				</button>
			</div>
		</ModalHeader>
		<ModalBody>
			<div class="row">
				<div>
					<VueApexchart width="350" type="bar" :options="getWorkStatus()" :series="series"></VueApexchart>
				</div>
			</div>
		</ModalBody>
		<ModalFooter>
			<div>
				<button class="btn cus_btn ml-2 btn-danger" @click="modalDismiss">Close</button>
			</div>
		</ModalFooter>
	</Modal>
</template>
<script>
// import ModalService from "../../modules/modals/services/modalchild.service";
// import InformationMessage from "../../views/modals/InformationMessage.vue";
import Modal from "../../modules/modals/components/ModalScreen.vue";
import ModalHeader from "../../modules/modals/components/ModalHeader.vue";
import ModalBody from "../../modules/modals/components/ModalBody.vue";
import ModalFooter from "../../modules/modals/components/ModalFooter.vue";
import ModalMixin from "../../modules/modals/mixins/ModalMixin";

export default {
    name: "EmployeeWorkProgress",
    data() {
        return {
            series: [{
				name: 'Employee Work Progress',
				data: [0, 0, 0],         
			}]
        }
    },
    props: {
		getProInfo: Array,
		selIdx: Number
    },
    mixins: [ModalMixin],
    components: { Modal, ModalHeader, ModalBody, ModalFooter },
    created() {
		if(this.$props.getProInfo.length > 0)
			this.series[0].data = this.$props.getProInfo;
    },
    methods: {
        modalDismiss: function () {
            this.dismiss("Modal dismissed");
        },
		getWorkStatus: function() {
			return {
				chart: {
					id: 'vuechart' + this.$props.selIdx,
				},
				xaxis: {
					categories: ["Pending", "In Progress",  "Completed"],                      
					colors:['#242424'],
				},
				plotOptions: {
					bar: {
						columnWidth: '33.3%',
						distributed: true,
						dataLabels: {
						style: {
							colors: ["#000000"],
						}
						},
					}
				},
				colors :['#ee4c5a', '#efbe27', '#36b553']
			}
		},
    }
}
</script>
