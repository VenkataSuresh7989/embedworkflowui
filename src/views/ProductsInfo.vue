<template>
	<div class="container">

		<!-- <div class="accordion mt-3" id="accordionExample">
			<div class="accordion-item">
				<h2 class="accordion-header" id="headingOne">
					<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
						<strong><font-awesome-icon :icon="['fas', 'circle-check']" /> Select Default Product</strong>
					</button>
				</h2>
				<div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
					<div class="accordion-body">					
						<div class="mb-3">
							<select class="form-select" aria-label="Default select example" v-model="ddlProdSel">
								<option value="" selected>-- select default Product --</option>
								<option v-for="(data,idx) in project_info" :key="idx" :value="data.id">{{ data.name }}</option>
							</select>
						</div>
						<div class="text-center">
							<button type="submit" class="btn cus_btn" @click="btnDefaultProd">Set Default Product </button>
						</div>						
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="headingTwo">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
						<strong><font-awesome-icon :icon="['fas', 'square-plus']" /> Create New Product</strong>
					</button>
				</h2>
				<div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
					<div class="accordion-body">
						<div class="cardWrap">
							<div class="mb-2">
								<label for="exampleProjectName" class="form-label">Product Name</label>
								<input type="text" class="form-control" id="exampleProjectName" v-model="txtName" aria-describedby="emailHelp" />
							</div>
							<div class="mb-2">
								<label for="exampleFrontend" class="form-label">Frontend</label>
								<input type="text" class="form-control" id="exampleFrontend" v-model="txtFrontend" aria-describedby="emailHelp" />
							</div>
							<div class="mb-2">
								<label for="exampleBackend" class="form-label">Backend</label>
								<input type="text" class="form-control" id="exampleBackend" v-model="txtBackend" aria-describedby="emailHelp" />
							</div>
							<div class="mb-2">
								<label for="exampleDatabse" class="form-label">Database</label>
								<input type="text" class="form-control" id="exampleDatabse" v-model="txtDatabase" aria-describedby="emailHelp" />
							</div>
							<div class="mb-2">
								<label for="exampleframework" class="form-label">Framework</label>
								<input type="text" class="form-control" id="exampleframework" v-model="txtFramework" aria-describedby="emailHelp" />
							</div>
							<div class="col-sm-12 text-center">
								<button type="submit" class="btn cus_btn" @click="btnAddProduct" :disabled="isDisable"> Add Product </button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div> -->
		


		<div class="row">
			<div class="text-center mb-4">
				<button class="btn cus_btn" @click="btnProdSel()"><font-awesome-icon :icon="['fas', 'check']" /> Select Default Product</button>
				<button class="btn cus_btn ml-3" v-if="!isDisable" @click="btnCreateProd()"><font-awesome-icon :icon="['fas', 'plus']" /> Create New Product</button>
			</div>
			<div class="col-sm-12">
				<div class="mt-3" style="width: auto">
					<div>
						<form @submit.prevent>
							<div class="row">
								<!-- Select Default Product -->
								<div class="col-sm-6"  v-if="isProdSelChk">
									<div class="cardWrap">
										<!-- <div class="col-sm-12 text-center">
											<h3 class="main-heading mb-4">
												<strong><font-awesome-icon :icon="['fas', 'circle-check']" /> Select Default Product</strong>
											</h3>											
										</div> -->
										<div class="col-sm-12 text-center">
											<div class="mb-3">
												<select class="form-select" aria-label="Default select example" v-model="ddlProdSel">
													<option value="" selected>-- select default Product --</option>
													<option v-for="(data,idx) in project_info" :key="idx" :value="data.id">{{ data.name }}</option>
												</select>
											</div>
											<button type="submit" class="btn cus_btn" @click="btnDefaultProd">Set Default Product </button>
										</div>
									</div>
								</div>
								<!-- Create New Product -->
								<div class="col-sm-6" v-if="isPCreateProdChk">
									<div class="cardWrap">
										<!-- <div class="text-center">
											<h3 class="main-heading mb-4">
												<strong><font-awesome-icon :icon="['fas', 'square-plus']" /> Create New Product</strong>
											</h3>
										</div> -->
										<div class="mb-2">
											<label for="exampleProjectName" class="form-label">Product Name</label>
											<input type="text" class="form-control" id="exampleProjectName" v-model="txtName" aria-describedby="emailHelp" />
										</div>
										<div class="mb-2">
											<label for="exampleFrontend" class="form-label">Frontend</label>
											<input type="text" class="form-control" id="exampleFrontend" v-model="txtFrontend" aria-describedby="emailHelp" />
										</div>
										<div class="mb-2">
											<label for="exampleBackend" class="form-label">Backend</label>
											<input type="text" class="form-control" id="exampleBackend" v-model="txtBackend" aria-describedby="emailHelp" />
										</div>
										<div class="mb-2">
											<label for="exampleDatabse" class="form-label">Database</label>
											<input type="text" class="form-control" id="exampleDatabse" v-model="txtDatabase" aria-describedby="emailHelp" />
										</div>
										<div class="mb-2">
											<label for="exampleframework" class="form-label">IDE</label>
											<input type="text" class="form-control" id="exampleframework" v-model="txtFramework" aria-describedby="emailHelp" />
										</div>
										<div class="col-sm-12 text-center">
											<button type="submit" class="btn cus_btn" @click="btnAddProduct"> Add Product </button> <!-- :disabled="isDisable" -->
										</div>
									</div>
								</div>								
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>		
		<div class="row">
			<div class="col-sm-6" v-for="(data, idx) in project_info" :key="idx">
				<div class="card products mt-3" style="width: auto">
					<div class="card-body" :class="(data.id ==  getProdSel) ? 'active' : ''">
						<h5>{{ data.name }}</h5>
						<ul>
							<li>Frontend : {{ data.frontend }}</li>
							<li>Backend : {{ data.backend }}</li>
							<li>Database : {{ data.database }}</li>
							<li v-if="(data.framework == '') ? false : true ">IDE : {{ data.framework }}</li>							
						</ul>
						<div class="actions mt-2">
							<button class="btn cus_btn" @click="btnEdit(data, data.id)" :disabled="isDisable"><font-awesome-icon :icon="['fas', 'pen-to-square']" /></button>
							<button class="ml-2 btn-danger btn cus_btn" @click="btnSelIdx(data.id)" :disabled="isDisable"><font-awesome-icon :icon="['far', 'trash-can']" /></button>
						</div>
					</div>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
import { chgDataFormat, getLabelInfo, getUserRole, getAllUserDBInfo } from "@/assets/script/common";
import ModalService from "../modules/modals/services/modalchild.service";
import InformationMessage from "../views/modals/InformationMessage.vue";
import ConfirmationMessage from "../views/modals/ConfirmationMessage.vue";
import { fetchAPIInfo } from "../assets/script/common.js";
import ProductInfoEdit from "../views/modals/ProductInfoEdit.vue";
import { eventBus } from "@/main";

export default {
  name: "ProductsInfo",
  data() {
    return {
		isProdSelChk: false,
		isPCreateProdChk: false,
		txtName: "",
		txtFrontend: "",
		txtBackend: "",
		txtDatabase: "",
		txtFramework: "",
		project_info: [],
		getProdSel: "",
		ddlProdSel: ""
    };
  },
  created() {
	this.getAllUserInfo();
  },
  computed: {
	isDisable: function() {
		let roleIdx = getUserRole();
		return ((roleIdx == 0) || (roleIdx == 1)) ? false : true;
	}
  },
  mounted() {
	eventBus.$on("getalluserinfo",()=>{
		this.getProductInfo();
	});
	eventBus.$on("btnRefresh",()=>{
		this.getProductInfo();
	});
	eventBus.$on("evtGetProductInfo",()=>{
		this.getProductInfo();
		this.txtName = "";
		this.txtFrontend = "";
		this.txtBackend = "";
		this.txtDatabase = "";
		this.txtFramework = "";
	});
	eventBus.$on("isRemoveProduct",(idx)=>{
		this.btnDelete(idx)
	});
  },
  destroyed() {
	eventBus.$off("btnRefresh");
	eventBus.$off("evtGetProductInfo");
	eventBus.$off("isRemoveProduct");
	eventBus.$off("getalluserinfo");
  },
  methods: {
	/* Get All User Info */
	getAllUserInfo() {
		getAllUserDBInfo()
	},
	/* Get All Products Info */
	async getProductInfo() {
		let resp = await fetchAPIInfo('get', '/getallproducts');
		if(resp.status == 200) {
			localStorage.setItem("product_info" + sessionStorage.getItem("access_token").toString(),JSON.stringify(resp.data));
			if(resp.status == 200) {
				this.project_info = resp.data;
				this.getProdIdx();
			}
		}
	},
	/* Get Product Selection */
	async getProdIdx() {
		let getEmpId = JSON.parse(localStorage.getItem("login_user" + sessionStorage.getItem("access_token")));
		let resp = await fetchAPIInfo('get', '/getproductsel?emp_id=' + getEmpId['emp_id']);
	
		if(resp.status == 200) {
			localStorage.setItem("product_idx" + sessionStorage.getItem("access_token").toString(),JSON.stringify(resp.data[0]));
			if(resp.status == 200) {
				this.getProdSel = resp?.data[0]?.["prod_idx"];
				this.ddlProdSel = resp?.data[0]?.["prod_idx"];
			}
		}
	},
	/* Update Product Selection */
	async btnDefaultProd() {
		let getProdInfo = JSON.parse(localStorage.getItem("product_idx" + sessionStorage.getItem("access_token").toString()));
		if((this.ddlProdSel != "") && (getProdInfo.prod_idx != this.ddlProdSel)) {
			let getEmpId = JSON.parse(localStorage.getItem("login_user" + sessionStorage.getItem("access_token")));
			let resp = await fetchAPIInfo('post', '/updateproductsel?emp_id=' + getEmpId['emp_id'] + '&prod_sel=' + this.ddlProdSel);
			if(resp.status == 200) {
				this.isProdSelChk = false;
				this.getProdIdx();
			}
		}
	},
	btnProdSel: function() {
		this.isProdSelChk = !this.isProdSelChk;
	},
	btnCreateProd: function() {
		this.isPCreateProdChk = !this.isPCreateProdChk;
	},
	/* Add New Product */
    async btnAddProduct() {
      let prodLabels = ["txtName", "txtFrontend", "txtBackend", "txtDatabase", "txtFramework"];
      let chgData = {};

      for (let prod in prodLabels) {
        if (this[prodLabels[prod.toString()]] == "" && (prodLabels[prod.toString()] != "txtDatabase" || prodLabels[prod.toString()] != "txtFramework")) {
          chgData = {};
          ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: getLabelInfo(prodLabels[prod]) + " cannot be empty."}]);
          return;
        } else {
          chgData[prodLabels[prod.toString()]] = {
            key: prodLabels[prod.toString()],
            value: this[prodLabels[prod.toString()]],
          };
        }
      }

		const response = await fetchAPIInfo("post", "/createproduct?data=" + encodeURIComponent(JSON.stringify(chgDataFormat(chgData))));
		if(response.status == 200) {
			eventBus.$emit("evtGetProductInfo");
		}
		else {
			ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: response.data}]);
		}
    },
	btnEdit: function(selProd, idx) {
		localStorage.setItem("editInfo" + sessionStorage.getItem("access_token").toString(), JSON.stringify(selProd));
		ModalService.open(ProductInfoEdit, [{ nameValues: selProd}, {idx : idx}]);
	},
	btnSelIdx: function(selProd) {
		ModalService.open(ConfirmationMessage, [{ msgTitle: "", msgInfo: "Are you sure you want to remove product?", nameValues:[selProd] }]);
	},
	async btnDelete(selProd) {		
		const response = await fetchAPIInfo("post", "/removeproduct?id=" + parseInt(selProd));
		if(response.status == 200) {
			eventBus.$emit("evtGetProductInfo");
		}
		else {
			ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: response.data}]);
		}
	}
  },
};
</script>
