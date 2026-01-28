<template>
	<div>
		<div class="container mt-3">
			<form  @submit.prevent>
				<div class="col-sm-12 text-center">
					<h3 class="main-heading mb-3"><strong>{{ $props.txtTitle }} </strong></h3>          
        </div>
				<div class="row">
					<div>
						<b-container fluid>
							<b-row class="mb-3">
								<b-col sm="4" v-show="allowPages">
									<b-form-group label="Per page" label-class="table_lable" label-for="per-page-select" label-cols-sm="6" label-cols-md="4" label-cols-lg="3" label-align-sm="right" label-size="sm" class="mb-0">
										<b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm"></b-form-select>
									</b-form-group>
								</b-col>
                <b-col sm="4" class="text-center">
                    <!-------------------------------------------------------------------------------------- Download TXT File -------------------------------------------------------------------------------------->		
                    <b-button v-if="isTxtFile" variant="primary" @click="downloadNames" class="btn cus_btn"><font-awesome-icon :icon="['far', 'file-lines']" style="font-size: 15px; margin-right: 3px;" /> Export to txt</b-button>                  
                </b-col>
								<b-col sm="4" v-show="allowFilter">
									<b-form-group label="Filter" label-for="filter-input" label-class="table_lable" label-cols-sm="3" label-align-sm="right" label-size="sm" class="mb-0">
										<b-input-group size="sm">
											<b-form-input id="filter-input" v-model="filter" type="search" placeholder="Type to Search"></b-form-input>
										</b-input-group>
									</b-form-group>
								</b-col>
							</b-row>
              
							<b-table sticky-header="300px" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" 
              :filter-included-fields="filterOn" label-sort-asc="" label-sort-desc="" label-sort-clear="" :sort-by.sync="sortBy" 
              :sort-desc.sync="sortDesc" :sort-direction="sortDirection" stacked="md" show-empty small @filtered="onFiltered" class="table-bordered fixed" 
              :class="getpageName">
								<template #cell(images)="row">

									<!-- <div class="round-image">
                      <img src="https://i.postimg.cc/FHtz5wGQ/20231210-142803.jpg" alt="">
                    </div> 
                  -->
									<!-- <div class="round-image" v-for="(data,idx) in row.item.images" :key="idx" > <img :src="getImage(data)" alt=""> </div> -->
                  <!-- Galeria com miniaturas -->
                  <main>
                    <section class="galeria">    
                      <div class="item">
                        <a :href="`#imagem${idx}`" v-for="(data,idx) in row.item.images" :key="idx">
                          <img :src="getImage(data)" alt="">
                        </a>      
                      </div>
                    </section>
                    <div class="lightboxes">
                      <div class="lightbox" :id="`imagem${idx}`"  v-for="(data,idx) in row.item.images" :key="idx">
                        <a href="#" class="fechar">&times;</a>
                        <div class="conteudo">
                          <img :src="getImage(data)" alt="">
                        </div>
                      </div>    
                    </div>
                  </main>
								</template>                
								<template #cell(actions)="row">
									<b-button v-show="allowEyeIcon" size="sm" @click="row.toggleDetails" class="btn cus_btn icon"> <font-awesome-icon :icon="['fas', (row.detailsShowing) ? 'eye-slash' : 'eye']" /></b-button>
									<b-button size="sm" v-if="isEditOption" @click="btnEdit(row.item, row.index)" class="btn cus_btn icon ms-2 me-2"><font-awesome-icon :icon="['fas', 'pen-to-square']" /> </b-button>
                  <b-button v-if="isDisable" size="sm" class="btn cus_btn icon btn-danger"  @click="btnRemove(row.item.id)"> <font-awesome-icon :icon="['fas', 'trash']" /></b-button>
              </template>
								<template #row-details="row">
                  <b-card style="background-color: #f5f8f9;">
									<div class="text-left" >
										<ul>
											<li v-for="(value, key) in filteredEmployeeData(row.item)" :key="key" class="mb-1"> <strong>{{ getKeyVal(key) }}</strong> : {{ value }} </li>
										</ul>
									</div>
                  </b-card>
								</template>
							</b-table>
							<b-row v-show="allowPagination">
								<b-col lg="6" class="my-1"></b-col>
								<!------------------------------------------------------------------------------------ Pagination ------------------------------------------------------------------------------------>
								<b-col sm="7" md="6" class="my-1">
									<b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
								</b-col>
							</b-row>												
						</b-container>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import ModalService from "../modules/modals/services/modal.service";
import BuildInfoEdit from "../views/modals/BuildInfoEdit.vue";
import TaskInfoEdit from "../views/modals/TaskInfoEdit.vue";
import VersionsInfoEdit from "../views/modals/VersionsInfoEdit.vue";
import FirmwaresInfoEdit from "../views/modals/FirmwaresInfoEdit.vue";
import ConfirmationMessage from "../views/modals/ConfirmationMessage.vue";
import { eventBus } from "@/main";
import { getLabelInfo, getFolderPath, getUserRole, getUser } from "@/assets/script/common";
import axios from "axios";
import { saveAs } from 'file-saver';

export default {
  name: "DataTable",
  props: {
    txtTitle: String,
    getFieldsInfo: Array,
    allowPages: {
      default: true,
      type: Boolean
    },
    allowFilter: {
      default: true,
      type: Boolean
    },
    allowEyeIcon: {
      default: true,
      type: Boolean
    },
    allowPagination: {
      default: true,
      type: Boolean
    },
  },
  data() {
    return {
      txtVersion: "",
      txtBuildName: "",
      ddlBuildType: "",
      ddlBuildOption: "",
      txtBuildPath: "",
      ddlStatus: "",
      txtFixedList: "",
      
      isEdit:"",
      items: [],
      fields: this.$props.getFieldsInfo,
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: this.totalRows, text: "All" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: { id: "info-modal", title: "", content: "" },
    };
  },
  computed: {
    getpageName: function() {
      let getRoute = this.$route.path;
      getRoute = getRoute.replace("/", "");
      return (getRoute) + 'tableInfo';
    },
    sortOptions() {
      return this.fields.filter((f) => f.sortable).map((f) => {
        return { text: f.label, value: f.key };
      });
    },
    isDisable: function() {
      let roleIdx = getUserRole();
      return ((this.$route.path == "/builds") && (roleIdx != 2)) ? false : (roleIdx == 0 || roleIdx == 1) ? false : true;
    },
    isEditOption: function() {
      let resp = false;
      if(this.$route.path == "/tasks") {
        resp = ((this.isEdit != '0') && (this.isEdit != '1'));
      }
      else if(this.$route.path == "/builds" || this.$route.path == "/versions") {
        let getUserInfo = getUser();
        resp = ((getUserInfo.job_role == '4') || (this.isEdit == '2'));
      }
      return resp;
    },
    isTxtFile: function() {
      return (this.$route.path == "/tasks") ? true : false;
    }
  },
  created() {
    this.isEdit = getUserRole();
  },
  mounted() {
    /* GET Build Information */
    this.totalRows = this.items.length;
    eventBus.$on("getInfo", (idx, resp, title) => {
      if(this.txtTitle == title)
      {
        this.filter = null;
        this.items = this.getItemsArr(idx, resp);
      }
    });
  },
  destroyed() {
    eventBus.$off("getInfo");
  },
  methods: {
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    // btnEdit: function (info, idx) {
    //   let getRoute = this.$route.path;
    //   localStorage.setItem("editInfo" + sessionStorage.getItem("access_token").toString(), JSON.stringify(info));
    //   let getEditScreen = (getRoute == "/builds") ? BuildInfoEdit : (getRoute == "/tasks") ? TaskInfoEdit : ((getRoute == "/versions") ? (this.txtTitle == "Firmware Versions Information") ? FirmwaresInfoEdit : (this.txtTitle == "Versions Information") ? VersionsInfoEdit : "" : "");
    //   ModalService.open(getEditScreen, [{ nameValues: info, idx: idx }]);
    // },
    btnEdit(info, idx) {
      const route = this.$route.path;
      localStorage.setItem(`editInfo${sessionStorage.getItem("access_token")}`, JSON.stringify(info));

      const EDIT_COMPONENT_MAP = {
        "/builds": BuildInfoEdit,
        "/tasks": TaskInfoEdit,
        "/versions": this.getVersionEditComponent()
      }

      const component = EDIT_COMPONENT_MAP[route];
      if (!component) return;
      ModalService.open(component, [{ nameValues: info, idx }]);
    },
    getVersionEditComponent() {
      if (this.txtTitle === "Firmware Versions Information") {
        return FirmwaresInfoEdit
      }
      if (this.txtTitle === "Versions Information") {
        return VersionsInfoEdit
      }
      return null
    },
    btnRemove: function(idx) {
      let confMsg = (this.$route.path == "/tasks") ? "task?" : (this.$route.path == "/builds") ? "build?" : (this.$route.path == "/versions") ? "version?" : ""; 
      ModalService.open(ConfirmationMessage, [{ msgTitle: "", msgInfo: "Are you sure you want to remove " + confMsg.toString(), nameValues:[idx, this.txtTitle] }]);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    filteredEmployeeData(employeeData) {
      /* Filter below array items */
      let excludedKeys = [ "id", "emp_id", "status", "password", "user_role", "job_role", "username", "photo", "_showDetails", "version", "build_name", "build_type", "build_option", "build_path", "images", "actions", "task", "task_progress", "_rowVariant" ];
      return Object.fromEntries(Object.entries(employeeData).filter(([key]) => !excludedKeys.includes(key)));
    },
    getItemsArr: function (idx, data) {
      let items = data;

      const updatedItems = items.map((item) => {
        let rowVariant = {};
        if(idx == 'build') {
            rowVariant = {
              'warning': item.build_status === '0',
              'danger': item.build_status === '1',
              'success': item.build_status === '2'
            }
        }
        if (idx == "task") {
          rowVariant = {
            warning: item.task_progress === "0",
            danger : item.task_progress === "1",            
            success: item.task_progress === "2",
          };
        }

        return {
          ...item,
          _rowVariant: Object.keys(rowVariant).find((key) => rowVariant[key]),
        };
      });
      return updatedItems;
    },    
    getKeyVal: function (key) {
      return getLabelInfo(key);
    },
    getImage: function(img) {
      let getImg = axios.defaults.baseURL + "/static/images/" + getFolderPath() + img.toString();
      return getImg;
    },
    // downloadNames() {
    //   const displayedItems = this.items.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
    //   const names = displayedItems.filter((item) => item.age > 20 && item.name.startsWith("G")).map((item) => item.name);
    //   const textData = names.join("\n");

    //   const blob = new Blob([textData], { type: "text/plain" });
    //   const url = URL.createObjectURL(blob);
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute("download", "person-names.txt");
    //   link.click();
    // },
    async downloadNames() {
      try {
        console.log("this.currentPage : ", this.currentPage);
        const displayedItems = (this.perPage == null) ? this.items : this.items.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
        let processedData = this.processJson(displayedItems);
        const blob = new Blob([processedData], { type: 'text/plain' });
        saveAs(blob, 'fixedList.txt');
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    },
    processJson(data) {
      return data.map((item) => (item['id'] + ".  " + item.task)).sort().join("\n");
    },
  },
};
</script>

