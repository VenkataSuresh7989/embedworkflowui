import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';


var baseIP = "192.168.1.6";
axios.defaults.baseURL = 'http://'+ baseIP + ':8000';

// var baseIP = "192.168.1.161";
// axios.defaults.baseURL = 'http://'+ baseIP + ':8000';

// var baseIP = location.hostname + ":8000";
// axios.defaults.baseURL = 'http://'+ baseIP;

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    getImg: require("../assets/images/logo.jpg"),
    popupName:'',
    gblConsolePrints:[],
    getItems1:[
      { 
        "id": 1,
        "emp_id": "EMBED7989",
        "user_role": "3",
        "username": "suresh",
        "password": "gAAAAABk_Iw8WGlYGen1U5sflD2AiiJ0VMTdFNcIm2GroOrLK9a7F-0fHqlI0KYQhrBQ43Tf4-VWyJbC1PmY-9cK2RDYjUUdDg==",
        "email": "suresh@gmail.com",
        "created_at": "2023-12-01 15:12:57",
        "created_by": "Nagesh",
        "updated_at": "2023-12-01 15:16:11",
        "updated_by": "Suresh",
        "active_status": "0",
        "job_role": "2",
        "qualification": "B.Tech",
        "skills": "JAVA,React,Vue,FastAPI",
        "phoneno": "7989586850",
        "address": "jhjsfh  jjshdjsad asddwdw jsbdjew sajdnweue jasdasdj jdajskdw ",
        "photo": "7c50de12-d839-4e2d-97d8-9eb917b6e9d4.jpg"
      },
      { 
        "emp_id" : "EMBED1234",
        "user_role" : "1",
        "job_role" : "0",
        "username" : "venkat",
        "email" : "venkat@gmail.com",  
        "qualification": "M.Tech",
        "skills" : "Python",
        "phoneno": "9542088420",
        "address":  "Geeth Sangeeth Theatre",
        "photo":  "7c50de12-d839-4e2d-97d8-9eb917b6e9d4.jpg",
        "created_at": "2023-12-30 15:12:57",
        "created_by": "Ravi",
        "updated_at": "2023-12-31 15:16:11",
        "updated_by": "Venkat"
      }
    ],
    getItems2:[
      {
        "id": 1,
        "build_date": "2023-12-05 17:18:11",
        "build_name": "Opti Server1",
        "build_type": "0",
        "build_option": "1",
        "build_path": "",
        "fixed_list": "* OA Changes required\n1. Hardware revision behaviour same as MB module\n2. Spin Control, allow only numeric values same as MB module for Mozilla browser\n",
        "version": "23.20.31",
        "created_by": "",
        "updated_at": "2023-12-24 12:28:06",
        "updated_by": "Admin",
        "status": "0"
      },
      // {
      //   "id": 2,
      //   "build_date": "2023-12-05 17:20:20",
      //   "build_name": "",
      //   "build_type": "1",
      //   "build_option": "0",
      //   "build_path": "",
      //   "fixed_list": "1. Device info label order\r\n2. Added hardware Revision",
      //   "version": "23.11.02",
      //   "created_by": "",
      //   "updated_at": "",
      //   "updated_by": "",
      //   "status": "0"
      // },
      // {
      //   "id": 3,
      //   "build_date": "2023-12-24 10:56:53",
      //   "build_name": "",
      //   "build_type": "1",
      //   "build_option": "1",
      //   "build_path": "",
      //   "fixed_list": "Spin issues fixed.",
      //   "version": "23.12.99",
      //   "created_by": "",
      //   "updated_at": "",
      //   "updated_by": "",
      //   "status": "0"
      // },
      // {
      //   "id": 4,
      //   "build_date": "2023-12-24 11:09:48",
      //   "build_name": "",
      //   "build_type": "1",
      //   "build_option": "1",
      //   "build_path": "",
      //   "fixed_list": "Device info label order.",
      //   "version": "23.20.30",
      //   "created_by": "",
      //   "updated_at": "",
      //   "updated_by": "",
      //   "status": "0"
      // },
      // {
      //   "id": 5,
      //   "build_date": "2023-12-24 11:10:33",
      //   "build_name": "",
      //   "build_type": "0",
      //   "build_option": "0",
      //   "build_path": "",
      //   "fixed_list": "Device info label order.",
      //   "version": "23.20.30",
      //   "created_by": "",
      //   "updated_at": "",
      //   "updated_by": "",
      //   "status": "0"
      // },
      // {
      //   "id": 6,
      //   "build_date": "2023-12-24 11:35:34",
      //   "build_name": "Opti Server",
      //   "build_type": "1",
      //   "build_option": "1",
      //   "build_path": "",
      //   "fixed_list": "Device info label order.",
      //   "version": "23.20.30",
      //   "created_by": "",
      //   "updated_at": "",
      //   "updated_by": "",
      //   "status": "0"
      // },
      // {
      //   "id": 7,
      //   "build_date": "2023-12-24 11:35:40",
      //   "build_name": "Opti Server",
      //   "build_type": "1",
      //   "build_option": "1",
      //   "build_path": "",
      //   "fixed_list": "Device info label order.",
      //   "version": "23.20.30",
      //   "created_by": "",
      //   "updated_at": "",
      //   "updated_by": "",
      //   "status": "0"
      // }
    ],
    getItems3:[
      {
        "id": 1,
        "emp_id": "EMBED7989",
        "task": "In utilities-- Mode Selection--Test Mode --> on clicking it shows confirmation msg. No button is not working. & we click outside conf. box the test mode value is holding instead of previous values.",
        "assigned_at": "2023-12-05 17:13:2",
        "assigned_by": "Ravi N",
        "task_progress": "0",
        "completed_at": "2023-12-05 18:13:2"
      },
      {
        "id": 2,
        "emp_id": "EMBED7989",
        "task": "In device configuration when we set port2 as 29 and port3/4 as  values as 5.65  conformation popup is being displayed.",
        "assigned_at": "2023-12-05 17:13:3",
        "assigned_by": "Nagesh",
        "task_progress": "1",
        "completed_at": ""
      },
      {
        "id": 3,
        "emp_id": "EMBED1535",
        "task": "Spin Controller issue",
        "assigned_at": "",
        "assigned_by": "Admin",
        "task_progress": "0",
        "completed_at": ""
      },
      {
        "id": 4,
        "emp_id": "EMBED7989",
        "task": "Manufacturing SET issues.",
        "assigned_at": "2023-12-24 14:24:22",
        "assigned_by": "Admin",
        "task_progress": "2",
        "completed_at": ""
      },
      {
        "id": 5,
        "emp_id": "EMBED7989",
        "task": "Device Config Alignment issues.",
        "assigned_at": "2023-12-24 14:36:22",
        "assigned_by": "Admin",
        "task_progress": "1",
        "completed_at": "2023-12-24 14:48:30"
      }
    ]
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
