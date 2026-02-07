<template>
	<div class="container pt-3">
		<form @submit.prevent>
			<!-- Heading -->
			<div class="row mb-3">
				<div class="col-12 text-center">
					<h5 class="main-heading"><strong>FUOTA</strong></h5>
        </div>
			</div>
			<!-- Status Cards -->
			<div class="row">
				<div class="col-6" v-for="(statusList, title) in fuotaStatus" :key="title">
					<div class="cardWrap mb-4">
						<h6 class="cardHeading mb-4">
              <font-awesome-icon :icon="['fas', 'arrows-to-dot']" />{{ title }}
            </h6>
						<div class="ps-4">
							<div class="row mb-2 align-items-center" v-for="(item, index) in statusList" :key="index">
								<div class="col-md-2 text-center">
									<label class="form-label">{{ item.code }}</label>
								</div>
								<div class="col-md-10">
									<input class="form-control" :value="item.description" readonly />
                </div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Input Section -->
			<div class="cardWrap mt-3">
				<h6 class="cardHeading mb-3">
          <font-awesome-icon :icon="['fas', 'arrows-to-dot']" />Device Status
        </h6>
				<div class="row">
					<div class="col-md-6 mb-2">
						<div class="row">
							<div class="col-md-12 mb-3">
								<label class="form-label">Select Device Type</label>
								<select v-model="deviceType" class="form-select">
									<option disabled value="">-- select --</option>
									<option value="128">128 - Transponder</option>
									<option value="129">129 - Amplifier</option>
								</select>
							</div>
							<div class="col-md-12 mb-3">
								<label class="form-label">Enter RX Input</label>
								<textarea v-model="txtSplitData" class="form-control" rows="6"></textarea>
							</div>
							<div class="col-md-12 mb-2 text-center">
								<button class="btn cus_btn" @click="getDetails"> Get Details </button>
								<button class="btn cus_btn ms-3" @click="resetDetails"> Reset </button>
							</div>
						</div>
					</div>
					<div class="col-md-6 mt-2">
						<div class="no-data p-2">
							<div v-if="result">
								<table class="table table-bordered simple-table">
									<tbody>
										<tr>
											<td><strong>Status</strong></td>
											<td>{{ result.status }}</td>
										</tr>
										<tr>
											<td><strong>Device Status</strong></td>
											<td>{{ result.devStatus }}</td>
										</tr>
										<tr>
											<td><strong>Message</strong></td>
											<td>{{result.devStatusMsg }}</td>
										</tr>
										<tr>
											<td><strong>Progress</strong></td>
											<td>{{result.devPercent }}</td>
										</tr>
										<tr>
											<td><strong>FW Version</strong></td>
											<td>{{result.fwVersion }}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div v-else>
								<div class="text-center mb-2 pt-5 pb-5" style="border: 1px solid #fff;;">
									<font-awesome-icon class="fa-5x opacity-25" :icon="['fas', 'magnifying-glass-arrow-right']" />
									<p class="text-center mt-3">Result will appear here…</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import ModalService from "../modules/modals/services/modal.service";
import InformationMessage from "../views/modals/InformationMessage.vue";

const DEVICE_CONFIG = {
  128: {
    name: "Transponder",
    fwRange: { start: 57, end: 58 },
  },
  129: {
    name: "Amplifier",
    fwRange: { start: 60, end: 61 },
  },
};

const STATUS_MAP = {
    "00": "Success (or) Not active",
    "01": "Upgrade Failed (or) Upgrade initialized but image transport not started",
    "02": "Upgrading... (or) On Going",
    "03": "Upgrade Failed (or) Upgrade image BAD",
    "04": "Upgrade image Ok",
    "05": "Restart Failed",
    "06": "Restart Pending"
};

export default {
  name: "FuotaInfo",

  data() {
    return {
      fuotaStatus: {
        "XPR Upgrade Status": [
          { code: "00", description: "Success (or) Not active" },
          { code: "01", description: "Upgrade Failed (or) Upgrade initialized but image transport not started" },
          { code: "02", description: "Upgrading... (or) On Going" },
          { code: "03", description: "Upgrade Failed (or) Upgrade image BAD" },
          { code: "04", description: "Upgrade image OK" },
          { code: "05", description: "Restart Failed" },
          { code: "06", description: "Restart Pending" },
        ],
        "Amplifier Upgrade Status": [
          { code: "0", description: "None" },
          { code: "1", description: "Image Transmitted" },
          { code: "2", description: "Success" },
          { code: "4", description: "Upgrade Failed" },
          { code: "8", description: "Upgrade Failed" },
        ],
      },

      deviceType: "",
      txtSplitData: "",
      result: null,
    };
  },

  methods: {
    getDetails() {
      this.result = null;

      if (!this.deviceType || !this.txtSplitData.trim()) {
        ModalService.open(InformationMessage, [{ msgTitle: "Information Message", msgInfo: "Please select device type and enter RX input." }]);
        return;
      }

      const hex = this.txtSplitData.trim();
      const bytes = hex.match(/.{1,2}/g) || [];

      const devStatus = this.getHex(hex, 66, 68, "00");
      const devPercent = this.getHex(hex, 68, 70, "00", true);
      const devStatusMsg = STATUS_MAP[devStatus] || "Unknown Status";
      const fwVersion = this.getFirmwareVersion(bytes);

      const status = this.getFinalStatus(devStatus, devPercent, hex);

      this.result = {
        devStatus,
        devStatusMsg,
        devPercent: `${devPercent}%`,
        fwVersion,
        status,
      };
    },

    resetDetails() {
      this.deviceType = "";
      this.txtSplitData = "";
      this.result = null;
      this.error = "";
    },

    /* ---------------- Helpers ---------------- */

    getHex(str, start, end, def = "00", isDec = false) {
      if (str.length < end) return isDec ? 0 : def;
      const val = str.substring(start, end);
      return isDec ? parseInt(val, 16) : val;
    },

    getFirmwareVersion(bytes) {
      const cfg = DEVICE_CONFIG[this.deviceType];
      if (!cfg) return "--.--";

      const slice = bytes.slice(
        cfg.fwRange.start,
        cfg.fwRange.end + 1
      );

      if (slice.length !== 2) return "--.--";

      const val = parseInt(slice.join(""), 16);
      return `${(val >> 8) & 0xff}.${val & 0xff}`;
    },

    getFinalStatus(devStatus, percent, hex) {
      if (this.deviceType === "128") {
        if (devStatus === "02") return `${STATUS_MAP[devStatus]} : ${percent}%`;
        return devStatus === "00" ? "Success" : STATUS_MAP[devStatus];
      }

      if (this.deviceType === "129" && devStatus === "06") {
        const dStatus = this.getHex(hex, 86, 88, "00", true);
        return dStatus ? parseInt(dStatus.toString(16), 16).toString(2).padStart(8, "0") : STATUS_MAP[devStatus];
      }

      return STATUS_MAP[devStatus];
    },
  },
};
</script>
