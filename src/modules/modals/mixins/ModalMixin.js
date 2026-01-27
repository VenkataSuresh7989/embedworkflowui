export default {
    props: {
        close: {
            type: Function,
            required: true,
        },
        dismiss: {
            type: Function,
            required: true,
        },
        msgTitle:{
            type:String,
            required:false,
        },
        msgIcon:{
            type:String,
            required:false,
        },
        msgInfo:{
            type:String,
            required:false,
        },
        nameValues:{
            type:Array,
            required:false,
        }
    },
};