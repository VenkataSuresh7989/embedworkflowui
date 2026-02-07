<template>
  <div>
    <div class="accordion" id="accordionExample">

      <div class="accordion-item" v-for="(items, title) in tooldata" :key="title">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#moduleid` + items.id" aria-expanded="true" :aria-controls="'moduleid' + items.id">
            {{ title }} <span><font-awesome-icon :icon="['fas', 'angle-down']" /></span>
          </button>
        </h2>
        <div :id="'moduleid' + items.id" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div class="p-2">
            <div class="cardWrap">              
              <div class="ps-4">
                <div class="row mb-2 align-items-center" v-for="item in items" :key="item.id">
                  <div class="col-md-4">
                    <label class="form-label">{{ item.label }}</label>
                  </div>
                  <div class="col-md-8">
                    <input type="text" class="form-control" :value="item.value" readonly />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="accordion-item" v-for="(items, title) in waittimedata" :key="title">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#collapseOne` + title" aria-expanded="true" :aria-controls="'collapseOne' + title">
            {{ title }} <span><font-awesome-icon :icon="['fas', 'angle-down']" /></span>
          </button>
        </h2>
        <div :id="'collapseOne' + title" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div class="p-2">
            <div class="cardWrap">              
              <div class="ps-4">
                <div class="row mb-2 align-items-center" v-for="item in items" :key="item.id">
                  <div class="col-md-4">
                    <label class="form-label">{{ item.label }}</label>
                  </div>
                  <div class="col-md-8">
                    <input type="text" class="form-control" :value="item.value" readonly />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#splitpanel`" aria-expanded="true" :aria-controls="'splitpanel'">
            Split Data <span><font-awesome-icon :icon="['fas', 'angle-down']" /></span>
          </button>
        </h2>
        <div :id="'splitpanel'" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div class="p-2">
            <div class="cardWrap">

              <!-- Input -->
              <div class="row mb-3">
                <div class="mt-2 ps-3 pe-3">
                  <textarea
                    v-model="txtSplitData"
                    class="form-control"
                    rows="6"
                    placeholder="Enter text here..."
                  ></textarea>

                  <div class="row">
                    <div class="col-md-6 text-center mt-3">
                      <button type="button" class="btn cus_btn" @click="btnSplitData">
                        Split Data
                      </button>
                    </div>
                    <div class="col-md-6 text-center mt-3">
                      <button type="button" class="btn cus_btn" @click="resetData">
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Output -->
              <div class="flexWrap split-info" v-if="splitData.length">
                <aside class="split-box" v-for="(item, index) in splitData" :key="index">
                  <span class="index">#{{ index }}</span>
                  <span class="value">{{ item }}</span>
                </aside>
              </div>

              <!-- No Data -->
              <div
                class="no-data text-center"
                v-else
                style="background-color: var(--subcard-bg); padding: 10px;"
              >
                <p class="mb-0">Split results will appear here...</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "QuickmenuScreen",
  data() {
    return {
      tooldata: {
        "Module ID": [
          {
            "label": "MB/BLE [0x43 || 67]",
            "value": "E9050210"
          },
          {
            "label": "XPR [0x45 || 69]",
            "value": "F3050404"
          },
          {
            "label": "XPR Loader",
            "value": "F2050405"
          },
          {
            "label": "FMX [0x46 || 70]",
            "value": "EE050409"
          },
          {
            "label": "FMX Loader",
            "value": "EE05020B"
          }
        ]
      },
      waittimedata: {
        "WaitTime": [
          {
            "label": "MSAM Status",
            "value": "30 Sec"
          }          
        ]
      },
      txtSplitData: "",
      splitData: [],
    };
  },
  methods: {
    btnSplitData() {
      if (!this.txtSplitData.trim()) {
        this.splitData = [];
        return;
      }

      const text = this.txtSplitData.replace(/\s+/g, "");

      this.splitData = [];
      for (let i = 0; i < text.length; i += 2) {
        this.splitData.push(text.substring(i, i + 2));
      }
    },

    resetData() {
      this.txtSplitData = "";
      this.splitData = [];
    }
  }
};
</script>
