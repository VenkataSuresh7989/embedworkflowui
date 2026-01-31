<template>
	<div>
		<!-- MSAM Tool Container -->
		<div class="container pt-3">
      <div class="text-center mb-4">
        <button class="btn cus_btn" @click="btnNewFrame"><font-awesome-icon :icon="['fas', 'plus']" /> Create New Frame</button>
      </div>

      <div class="row" v-if="isCheck">
        <div class="col-sm-5">
          <form>
            <div class="cardWrap">
              <h6 class="cardHeading mb-3">
                <font-awesome-icon :icon="['fas', 'plus']" />
                Add Frame
              </h6>              
              <div class="row mb-3 align-items-center">
                <div class="col-md-12">
                  <label class="form-label"> Enter Frame Name </label>
                  <input type="text" class="form-control" />
                </div>                
                <div class="col-md-12 text-center mt-3">
                  <button type="button" class="btn cus_btn">Add Frame </button>
                </div>
              </div>              
            </div>
          </form>
        </div>
        <div class="col-sm-7">
            <form >
              <div class="cardWrap">
                <h6 class="cardHeading mb-3">
                  <font-awesome-icon :icon="['fas', 'plus']" />
                  Add Field
                </h6>              
                <div class="row mb-3 align-items-center">
                  <div class="col-md-6 mb-2">                    
                    <label  class="form-label">Select Frame</label>
                    <select class="form-select" aria-label="Default select example">
                      <option value="" selected disabled>-- select frame --</option>
                      <option value="1">Frame 1</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-2">                    
                    <label  class="form-label">Enter Label</label>
                    <input type="text" class="form-control" id="exampleInputLabel" maxlength="8" />
                  </div>                
                  <div class="col-md-6 mb-2">
                    <label  class="form-label">Enter Value</label>
                    <input type="text" class="form-control" id="exampleInputValue" maxlength="8" />
                  </div>  
                  <div class="col-md-6 mb-2">                    
                    <label  class="form-label">Copy Required?</label>
                    <select class="form-select" aria-label="Default select example" v-model="is_Copy">
                      <option value="" selected disabled>-- select frame --</option>
                      <option value="1">Yes</option>
                      <option value="2">No</option>
                    </select>
                  </div>              
                  <div class="col-md-12 text-center mt-3">
                    <button type="button" class="btn cus_btn">Add Field</button>
                  </div>
                </div>
                
              </div>
            </form>
        </div>
      </div>

			<form>
				<div class="row mb-3">
					<div class="col-12 text-center">
						<h5 class="main-heading"><strong> MSAM</strong></h5>
          </div>
				</div>
				<div class="cardWrap" v-for="(items, title) in tooldata" :key="title">
					<h6 class="cardHeading mb-3">
            <font-awesome-icon :icon="['fas', 'globe']" />
            {{ title }}
          </h6>
					<div class="ps-5">
						<div class="row mb-3 align-items-center" v-for="(item, index) in items" :key="index">
							<div class="col-md-3">
								<label class="form-label"> {{ item.label }} </label>
							</div>
							<div class="col-md-7">
								<input type="text" class="form-control" :value="item.value" readonly/>
              </div>
							<div class="col-md-2 text-end" v-show="item.isCopy">
								<button type="button" class="btn cus_btn" @click="copyText(item.value)">
									<font-awesome-icon :icon="['fas', 'copy']" /> Copy </button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
export default {
  name: "MsamTool",
  data() {
    return {
      isCheck: false,
      is_Copy:"1",
      tooldata: {
        "MSAM Keys": [
          { label: "name", value: "Device Name", isCopy: false },
          {
            label: "dev_eui",
            value: "Device Extended Unique Identifier",
            isCopy: false,
          },
          {
            label: "app_key",
            value: "Application Key (For FUOTA)",
            isCopy: false,
          },
          {
            label: "join_eui",
            value: "Join Extended Unique Identifier",
            isCopy: false,
          },
          {
            label: "nwk_key",
            value: "Network Key (For Join Request & Response)",
            isCopy: false,
          },
        ],
        "Module ID": [
          { label: "MB/BLE [0x43 || 67]", value: "E9050210", isCopy: true },
          { label: "XPR [0x45 || 69]", value: "F3050404", isCopy: true },
          { label: "XPR Loader", value: "F2050405", isCopy: true },
          { label: "FMX [0x46 || 70]", value: "EE050409", isCopy: true },
          { label: "FMX Loader", value: "EE05020B", isCopy: true },
        ],
        "VPN Configuration": [
          {
            label: "Portal",
            value: "ctec-vpn-test.charterlab.com",
            isCopy: true,
          },
          { label: "Username", value: "P3318271", isCopy: true },
          { label: "Password", value: "NR@msam_2025", isCopy: true },
        ],

        "AWS Join & FUOTA Server URL(s)": [
          {
            label: "Join Server API",
            value: "https://joinserver.embedtechnologies.com/joinreq",
            isCopy: true,
          },
          {
            label: "FUOTA Server API",
            value: "https://joinserver.embedtechnologies.com/v1/mcrootkey",
            isCopy: true,
          },
        ],
        "Charter Join & FUOTA Server URL(s)": [
          {
            label: "Join Server API",
            value: "https://joinserver.caas.charterlab.com:443",
            isCopy: true,
          },
          {
            label: "FUOTA Server API",
            value: "https://joinserver.caas.charterlab.com/v1/mcrootkey",
            isCopy: true,
          },
        ],
      },
    };
  },
  methods: {
    btnNewFrame: function() {
			this.isCheck = !this.isCheck;
		},
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
  },
};
</script>
