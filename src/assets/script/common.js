import { eventBus } from '@/main';
import axios from 'axios';
import ModalService from "../../modules/modals/services/modalchild.service";
import InformationMessage from "../../views/modals/InformationMessage.vue";


/* ---------------------------------------------------------------- COMMON CRUD FUNCTION ---------------------------------------------------------------- */

export async function fetchAPIInfo(method, getUrl, data = {}, isFormData = false) {
  try {
    const headers = { 'Content-Type': isFormData ? 'multipart/form-data' : 'application/json' };
    const accessToken = localStorage.getItem(`access_token${sessionStorage.getItem("access_token")}`);

    if (accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
    }

    const response = await axios({
      method,
      url: axios.defaults.baseURL + getUrl,
      data: isFormData ? data : JSON.stringify(data),
      headers,
    });
    return response.data;
  } catch (error) {
    if(error.response.data.detail == "Session expired.") {
      eventBus.$emit("isSignout");
    }
    if(error.response.data.detail == "Password mismatch." || error.response.data.detail == "User not found.")
    {
      ModalService.open(InformationMessage, [{msgTitle: "Information Message", msgInfo: error.response.data.detail}]);
    }
    console.error("API request error:", error);
    throw error;
  }
}

/* ---------------------------------------------------------------- GET LOGIN USER INFORMATION -------------------------------------------------------------- */

export function getUser() {
  let user = JSON.parse(localStorage.getItem("login_user" + sessionStorage.getItem("access_token")));
  let resp = (user != undefined || user != null) ? user : "";
  return resp;
}

/* --------------------------------------------------------------------- GET USER ROLE ---------------------------------------------------------------------- */

export function getUserRole() {
  let userInfo = getUser();
  return (userInfo != undefined && userInfo != null) ? userInfo['user_role'] : "";
}


/* ---------------------------------------------------------------- GET ALL USER INFORMATION  FROM DB ---------------------------------------------------------------- */

export async function getAllUserDBInfo() {
  let resp = [];
  resp = await fetchAPIInfo("get", "/getalluser");
  if (resp) {
    localStorage.setItem("alluserinfo" + sessionStorage.getItem("access_token").toString(), JSON.stringify(resp));
    eventBus.$emit("getalluserinfo", resp);
    return resp;
  }
  return resp;
}


/* ---------------------------------------------------------------- GET ALL USER INFORMATION ---------------------------------------------------------------- */

export function getAllUserInfo() {
  let user = JSON.parse(localStorage.getItem("alluserinfo" + sessionStorage.getItem("access_token")));
  let resp = (user != undefined || user != null) ? user : "";
  return resp;
}

/* ---------------------------------------------------------------- CHANGED DATA FORMATER ---------------------------------------------------------------- */

export function chgDataFormat(chgData) {
  return [ Object.fromEntries(Object.entries(chgData).map(([key, value]) => [key, value.value]))];
}

/* ---------------------------------------------------------------- GET PRODUCT ID -------------------------------------------------------------------- */

export function getProdIdx(opt) {
  let resp = JSON.parse(localStorage.getItem("product_idx" + sessionStorage.getItem("access_token").toString()));  
  return (resp != undefined && resp != null) ? resp[opt] : "";
}

/* ---------------------------------------------------------------- GET ORIFINAL INFO ---------------------------------------------------------------- */

export function getOrgInfo(item) {
  let getInfo = JSON.parse(localStorage.getItem(item.toString() + sessionStorage.getItem("access_token").toString()));
  return getInfo;
}

/* ---------------------------------------------------------------- GET LABELS INFO ---------------------------------------------------------------- */

export function getLabelInfo(key) {
  let variableArr = ["emp_id","user_role","job_role","user_name","email","skills","phoneno","address","photo","created_at","created_by","updated_at","updated_by","build_date","version","build_name","build_type","build_option","fixed_list","txtVersion", "txtBuildName", "ddlBuildType", "ddlBuildOption", "txtBuildPath", "build_path", "txtFixedList", "qualification", "username", "password","ddlUserSel", "txtTask", "assigned_by", "assigned_at", "txtName", "txtFrontend", "txtBackend", "txtDatabase", "txtFramework", "build_status", "remark", "product_id", "opti_server", "cada", "amp_android", "amp_ios", "msam", "xpr", "mb_ble", "flex_max"];
  let lableArr = ["Emp Id","User Role","Job Role","User Name","Email","Skills","Phone Number","Address","Photo","Created At","Created By","Updated At","Updated By","Build Date","Version","Build Name","Build Type","Build Option","Fixed List","Version", "Build Name", "Build Type", "Build Option", "Build Path", "Build Path", "Fixed List", "Qualification", "Username", "Password", "Assigned To", "Task", "Assigned By", "Assigned At", "Product Name", "Frontend", "Backend", "Database", "IDE", "Build Status", "Remark", "Product Id", "Opti Server", "CADA", "Amplifier Android", "Amplifier iOS", "MSAM", "XPR", "MB-BLE", "Flex Max"];
  let resp = (variableArr.indexOf(key) != -1) ? lableArr[variableArr.indexOf(key)] : "";
  return resp;
}

/* ---------------------------------------------------------------- GET SELECTED IDX INFO ---------------------------------------------------------------- */
export function getSelIdxInfo(type) {
  let itemKey = "editInfo" + sessionStorage.getItem("access_token").toString();
  let itemExists = localStorage.getItem(itemKey) !== null;
  
  if(type == "GET")
    return (itemExists) ? JSON.parse(localStorage.getItem(itemKey)) : {};
  else
    localStorage.removeItem(itemKey);
}

/* ---------------------------------------------------------------- Verify Only Numbers ---------------------------------------------------------------- */
export function onlyNumbers (inputString) {
  let resultString = '';    
  let minusUsed = false;
  let finalMinus = false;
  let finalResult = '';
  const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '=', '+', '-', '.', '[', ']', '{', '}', '\\', '|', ';', ':', "'", '"', ',', '<', '>', '/', '?', '`', '~', ' '];

  if ((inputString == undefined) || (inputString == null) || (inputString == '')) {
    return '';
  }

  for (let i = 0; i < inputString.length; i++) {
    const curChar = inputString[i].toString();
    if ((!(curChar >= 'a' && curChar <= 'z') && !(curChar >= 'A' && curChar <= 'Z')) && !(specialCharacters.includes(curChar))) {
      resultString += curChar;  
      if (curChar === '-') {
        if (!minusUsed) {
          minusUsed = true;
        } else {
          // If '-' is used more than once, remove the extra occurrences
          resultString = resultString.slice(0, -1);
        }
      } 
    }
  }

  if (resultString.length >= 2) {
    resultString = resultString.replace(/^0+/, '');
  }

  for (let i = 0; i < resultString.length; i++) {
    const curChar = resultString[i].toString();
    if (curChar != "-")
      finalResult += curChar;
    else
      finalMinus = true;
  }   
  return (finalMinus) ? "-"+finalResult : finalResult;
} 


/* ---------------------------------------------------------------- GET FOLDER PATH ---------------------------------------------------------------- */
export function getFolderPath () {
  return (window.location.pathname == "/tasks") ? "tasks/" : (window.location.pathname == "/builds") ? "builds/" : (window.location.pathname == "/employee") ? "users/" : "";
}

export function showLoader(msg = "Loading..."){
  document.getElementById("loaderMsg").innerHTML = msg;
  document.getElementById("loader").classList.add("d-flex");
}

export function hideLoader(){  
  document.getElementById("loader").classList.remove("d-flex");
  document.getElementById("loader").classList.add("d-none");
}
