<template>
    <div class="scroll-nav-panel">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'scrollnav-panel',
        props: {
            label: Object,
            idCus:String,
            lang:String
        },
        mounted() {
            this.$parent.lang = this.$props.lang;
            this.$parent.addItem({label: this.label, id:this.idCus, _uid: this._uid});
        },
        watch:{
            lang(newV,oldV){
                this.$parent.lang = this.$props.lang;
            }
        }
    }
</script>
