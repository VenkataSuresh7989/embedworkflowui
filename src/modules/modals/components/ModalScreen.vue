<template>
  <div class="modal">
    <div class="modal-dialog" v-bind:class="(this.dialogName != '') ? this.dialogSize : ''">
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
import {store} from "../../../store/index"
export default ({  
  data(){
    return{
      dialogName: store.popupName,
      dialogSize:'',
    }   
  },  
  mounted(){
    if (document.querySelector('.modal.d-block'))
      document.body.classList.add('overflow-hidden');    
  },
  created(){    
    var dlgName = this.dialogName;
    var psize = '';    
    switch (dlgName) {      
        case "1": { psize = "win-100"; } break;
        case "2": { psize = "win-150"; } break;
        case "UploadPackage": { psize = "win-350 modal-dialog-centered"} break;
        case "AboutUs": { psize = "win-350 modal-dialog-centered"} break;
        case "ProfileRename": { psize = "win-350 modal-dialog-centered"} break;        
        case "TrunkingpadChangeConfirmation":
        case "TrunkLevelPadValueConfirmation": { psize = "win-450 modal-dialog-centered"} break;
        case "Loader": { psize = "win-auto modal-dialog-centered loaderPopup"} break;
        case "WiFiConfig":
        case "FirmwareUpgrade": { psize = "win-400 modal-dialog-centered"} break;        
        case "ConfirmationMessage":
        case "InformationMessage": { psize = "win-400 modal-dialog-centered"} break;
        case "BuildInfoEdit": { psize = "win-550 modal-dialog-centered" } break;
        case "ProfileInfo": { psize = "win-550 modal-dialog-centered" } break;
        case "UserInfoEdit":
        case "AddNewUser":{ psize = "win-550 modal-dialog-centered" } break;
        case "25": { psize = "win-1300" } break;
        case "26": { psize = "win-1350" } break;        
        default: { psize = "win-400" } break;
    }
    this.dialogSize = psize;    
  }
})
</script>
<style scoped>   
      
</style>