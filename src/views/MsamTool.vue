<template>
	<div>
		<!-- MSAM Tool Container -->
		<div class="container pt-3">
			<!-- Create Frame Button -->
			<div class="text-center mb-4">
				<button class="btn cus_btn" @click="toggleFrame">
          <font-awesome-icon :icon="['fas', 'plus']" /> Create New Frame 
        </button>
			</div>
			<!-- Add Frame / Field Section -->
			<div class="row" v-if="isCheck">
				<!-- Add Frame -->
				<div class="col-sm-5">
					<form @submit.prevent>
						<div class="cardWrap">
							<h6 class="cardHeading mb-3">
                <font-awesome-icon :icon="['fas', 'plus']" /> Add Frame
              </h6>
							<div class="mb-3">
								<label class="form-label">Enter Frame Name</label>
								<input type="text" class="form-control" v-model.trim="formHeader" />
              </div>
							<div class="text-center">
								<button type="button" class="btn cus_btn" @click="btnAddNewFrame"> Add Frame </button>
							</div>
						</div>
					</form>
				</div>
				<!-- Add Field -->
				<div class="col-sm-7">
					<form @submit.prevent>
						<div class="cardWrap">
							<h6 class="cardHeading mb-3">
                <font-awesome-icon :icon="['fas', 'plus']" /> Add Field
              </h6>
							<div class="row">
								<div class="col-md-6 mb-2">
									<label class="form-label">Select Frame</label>
									<select class="form-select" v-model="formFields.header_id">
										<option disabled value="">-- select frame --</option>
										<option v-for="header in toolHeaders" :key="header.id" :value="header.id"> {{ header.name }} </option>
									</select>
								</div>
								<div class="col-md-6 mb-2">
									<label class="form-label">Enter Label</label>
									<input type="text" class="form-control" v-model.trim="formFields.label" />
                </div>
								<div class="col-md-6 mb-2">
									<label class="form-label">Enter Value</label>
									<input type="text" class="form-control" v-model.trim="formFields.value" />
                </div>
								<div class="col-md-6 mb-2">
									<label class="form-label">Copy Required?</label>
									<select class="form-select" v-model="formFields.is_copy">
										<option disabled value="">-- select --</option>
										<option value="0">No</option>
										<option value="1">Yes</option>
									</select>
								</div>
								<div class="col-md-12 text-center mt-3">
									<button type="button" class="btn cus_btn" @click="btnAddNewFrameItems()"> Add Field </button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
			<!-- Tool Data Display -->
			<form @submit.prevent>
				<div class="row mb-3">
					<div class="col-12 text-center">
						<h5 class="main-heading"><strong>MSAM</strong></h5>
          </div>
				</div>
				<div class="cardWrap" v-for="(items, title) in tooldata" :key="title">
					<h6 class="cardHeading mb-3">
            <font-awesome-icon :icon="['fas', 'globe']" /> {{ title }}
          </h6>
					<div class="ps-5">
						<div class="row mb-3 align-items-center" v-for="item in items" :key="item.id">
							<div class="col-md-3">
								<label class="form-label">{{ item.label }}</label>
							</div>
							<div class="col-md-7">
								<input type="text" class="form-control" :value="item.value" readonly />
              </div>
							<div class="col-md-2 text-end" v-if="item.isCopy">
								<button class="btn cus_btn" @click="copyText(item.value)">
									<font-awesome-icon :icon="['fas', 'copy']" /> Copy 
                </button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
import ModalService from "../modules/modals/services/modal.service";
import InformationMessage from "../views/modals/InformationMessage.vue";
import { fetchAPIInfo } from "@/assets/script/common";
import { eventBus } from "@/main";

const DEFAULT_FORM_FIELDS = () => ({
  header_id: "",
  label: "",
  value: "",
  is_copy: "1",
});

export default {
  name: "MsamTool",

  data() {
    return {
      isCheck: false,
      toolHeaders: [],
      tooldata: {},
      formHeader: "",
      formFields: DEFAULT_FORM_FIELDS(),
    };
  },

  created() {
    this.getMsamToolInfo();
  },

  mounted() {
    eventBus.$on("btnRefresh", this.getMsamToolInfo);
  },

  unmounted() {
    eventBus.$off("btnRefresh", this.getMsamToolInfo);
  },

  methods: {
    /* -------------------- UI -------------------- */
    toggleFrame() {
      this.isCheck = !this.isCheck;
    },

    resetFormFields() {
      this.formFields = DEFAULT_FORM_FIELDS();
    },

    showInfo(msg) {
      ModalService.open(InformationMessage, [
        { msgTitle: "Information Message", msgInfo: msg },
      ]);
    },

    /* -------------------- Clipboard -------------------- */
    copyText(value) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value);
      } else {
        // Fallback (older browsers)
        const tempInput = document.createElement("textarea");
        tempInput.value = value;
        tempInput.style.position = "fixed";
        tempInput.style.opacity = "0";
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
    },

    /* -------------------- API -------------------- */
    async getMsamToolInfo() {
      try {
        const resp = await fetchAPIInfo("get", "/gettoolheader");
        if (resp?.status !== 200 || !Array.isArray(resp.data)) return;

        this.toolHeaders = [];
        this.tooldata = {};

        resp.data.forEach(({ id, name, items = [] }) => {
          this.toolHeaders.push({ id, name });
          this.tooldata[name] = items.map(item => ({
            id: item.id,
            label: item.label,
            value: item.value,
            isCopy: Boolean(item.is_copy),
          }));
        });
      } catch (err) {
        console.error("Error fetching MSAM tool info", err);
      }
    },

    async btnAddNewFrame() {
      if (!this.formHeader) {
        return this.showInfo("Frame Name cannot be empty.");
      }

      const resp = await fetchAPIInfo("post", `/createtoolheaders?headername=${encodeURIComponent(this.formHeader)}`);

      if (resp?.status === 200) {
        this.formHeader = "";
        this.resetFormFields();
        this.getMsamToolInfo();
      }
    },

    async btnAddNewFrameItems() {
      if (!this.isFormValid()) return;

      const dataParam = encodeURIComponent(JSON.stringify([this.formFields]));

      const resp = await fetchAPIInfo("post", `/createtoolheaderitems?data=${dataParam}`);

      if (resp?.status === 200) {
        this.resetFormFields();
        this.getMsamToolInfo();
      }
    },


    /* -------------------- Validation -------------------- */
    isFormValid() {
      const rules = {
        header_id: "Select Frame",
        label: "Label",
        value: "Value",
      };

      for (const key in rules) {
        if (!this.formFields[key]) {
          this.showInfo(`${rules[key]} cannot be empty.`);
          return false;
        }
      }
      return true;
    },
  },
};
</script>
