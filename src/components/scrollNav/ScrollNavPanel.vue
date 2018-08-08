<template>
    <div class="scroll-nav-panel">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'scrollnav-panel',
        props: {
            label: String,
            idCus:String
        },
        mounted() {
            this.$parent.addItem({label: this.label, id:this.idCus, _uid: this._uid});
        }
    }
</script>
