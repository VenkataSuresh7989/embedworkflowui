<template>
	<div class="container">
		<div class="cardWrap mt-4">
			<h6 class="cardHeading mb-3">
				<font-awesome-icon :icon="['fas', 'plus']" />Loopback Test
			</h6>
			<div class="row">
				<!-- Formula (optional but clean) -->
				<div class="mt-2">
					<p><strong>Formula :</strong> (Device Count × 2 × No. of Times) + ((Device Count × Count) × No. of Times)</p>
				</div>
				<!-- Device Count -->
				<div class="col-md-6">
					<div class="row">
						<div class="col-md-12 mb-2">
							<label class="form-label">Device Count</label>
							<input type="number" class="form-control" v-model="formFields.deviceCount" @input="validateInteger('deviceCount')" placeholder="Enter Device Count" />
						</div>
						<!-- Count -->
						<div class="col-md-12 mb-2">
							<label class="form-label">Count</label>
							<input type="number" class="form-control" v-model="formFields.count" @input="validateInteger('count')" placeholder="Enter Count" />
						</div>
						<!-- No of Times -->
						<div class="col-md-12 mb-2">
							<label class="form-label">No. of Times</label>
							<input type="number" class="form-control" v-model="formFields.times" @input="validateInteger('times')" placeholder="Enter No. of Times" />
						</div>
						<div class="col-md-12">
							<!-- Button -->
							<div class="col-md-12 text-center mt-3">
								<button type="button" class="btn cus_btn" @click="calculateLoopback"> Calculate </button>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div v-if="result !== null" class="mt-5">
						<table class="table table-bordered simple-table">
							<tbody>
								<tr>
									<td><strong>Device Count</strong></td>
									<td>{{ formFields.deviceCount }}</td>
								</tr>
								<tr>
									<td><strong>Count</strong></td>
									<td>{{ formFields.count }}</td>
								</tr>
								<tr>
									<td><strong>No. of Times</strong></td>
									<td>{{ formFields.times }}</td>
								</tr>
								<tr>
									<td><strong>Final Result</strong></td>
									<td>{{result }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import ModalService from "../modules/modals/services/modal.service";
import InformationMessage from "../views/modals/InformationMessage.vue";
export default {
  name: "LoopbackInfo",

  data() {
    return {
      formFields: {
        deviceCount: "",
        count: "",
        times: "",
      },
      result: null,
    };
  },

  methods: {
    validateInteger(field) {
      this.formFields[field] = this.formFields[field]
        .toString()
        .replace(/[^0-9]/g, "");
    },

    calculateLoopback() {
      const d = parseInt(this.formFields.deviceCount) || 0;
      const c = parseInt(this.formFields.count) || 0;
      const t = parseInt(this.formFields.times) || 0;

      if (!d || !c || !t) {
        ModalService.open(InformationMessage, [
        { msgTitle: "Information Message", msgInfo: "Please enter all values" },
      ]);
        this.result = null;
        return;
      }

      this.result = d * 2 * t + d * c * t;
    },
  },
};

</script>