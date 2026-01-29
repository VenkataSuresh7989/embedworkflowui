<template>
	<!-------------------------------------- Versions Information -------------------------------------------------------------------------------->
    <div>
        <DataTable  :getFieldsInfo="getVerFieldsInfo"  :txtTitle="'Versions Information'" :allowEyeIcon="false" :allowPages="false" :allowFilter="false" :allowPagination="false" />
        <DataTable  :getFieldsInfo="getFWFieldsInfo"  :txtTitle="'Firmware Versions Information'" :allowPagination="false" :allowPages="false" :allowFilter="false" :allowEyeIcon="false" />
    </div>
</template>
<script>
import { fetchAPIInfo, getUser } from "@/assets/script/common";
import DataTable from '../components/DataTable.vue';
import { eventBus } from '@/main';
export default {
    name: "VersionsInfo",
    data() {
        return {
            getVerFieldsInfo : [
                { key: "opti_server", label: "Opti-Server", sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
                { key: "cada", label: "CADA", sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
                { key: "amp_android", label: "Amplifier Android", sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
                { key: "amp_ios", label: "Amplifier iOS", sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
                { key: "msam", label: "MSAM", sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
                { key: 'actions', label: 'Actions' }
            ],
            getFWFieldsInfo : [
                { key: "xpr", label: "XPR", sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
                { key: "mb_ble", label: "MB-BLE", sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
                { key: "flex_max", label: "Flex Max", sortable: true, sortByFormatted: true,filterByFormatted: true, sortDirection: "desc" },
                { key: 'actions', label: 'Actions' }
            ],
        }
    },
    components: {
        DataTable
    },
    created() {
        this.getVersionsInfo();
        /* Based on user role(except Manager) hide the action column. */
        let getUserInfo = getUser();
        let resp = (getUserInfo.user_role != '2');
        if(resp)
        {
            this.getVerFieldsInfo = this.getVerFieldsInfo.filter(f => f.key !== "actions");
            this.getFWFieldsInfo = this.getFWFieldsInfo.filter(f => f.key !== "actions");
        }
    },
    mounted() {
        eventBus.$on("btnRefresh",()=> {
            this.getVersionsInfo();
        });
        eventBus.$on("evtGetVersionInfo",()=> {
            this.getVersionsInfo();
        });
        eventBus.$on("isRemoveVersion", (idxArr) => {
            this.removeVersion(idxArr[0], idxArr[1]);
        });
    },
    destroyed() {
        eventBus.$off("btnRefresh");
        eventBus.$off("evtGetVersionInfo");
        eventBus.$off("isRemoveVersion");
    },
    methods: {
        /* ------------------------------------------ Get Build Info  ----------------------------------------- */
        async getVersionsInfo() {
            let resp = await fetchAPIInfo('get', '/getversionsinfo');
            if(resp.status == 200) {
                localStorage.setItem("versions_info" + sessionStorage.getItem("access_token").toString(),JSON.stringify(resp.data));
                eventBus.$emit("getInfo", "versions", resp?.data?.["tbl_module_info"], "Versions Information");
                eventBus.$emit("getInfo", "versions", resp?.data?.["tbl_fw_info"], "Firmware Versions Information");
            }
        },
        /* ----------------------------------------- Remove Selected Build ------------------------------------ */
        async removeVersion(idx, tbl_type) {
            let url = (tbl_type == "Versions Information") ? "/deletemodule" : (tbl_type == "Firmware Versions Information") ? "/deletefw" : "";
            if(url != "")
            {
                let resp = await fetchAPIInfo('post', `${url}?id=` + parseInt(idx));
                if(resp.status == 200) {
                    this.getVersionsInfo();
                }
            }
        }
    }
}
</script>

