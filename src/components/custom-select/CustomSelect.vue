<template>
	<div class="custom-select">
		<div class="select-label-wrapper"  @click = "showMenu">
			<span class="select-label">{{selectLabel||"Please Select"}}</span>
			<i class= "icon-down arrow-icon"></i>
		</div>
		<div class="select-menu" :class = "{'select-menu-up':true,'select-menu-down':false}" v-show = "bShowMenu">
			<ul class="select-menu-list">
				<li v-for = "(item,itemIndex) in $props.options" @click = "selectItem(item,itemIndex)" :key = "itemIndex" :class = "{'selected': item.label == selectLabel}">
					{{item.label}}
				</li>
			</ul>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{
		name:"custom-select",
		props:{
			label:{
				type:[String,Number],
				default:"Please Select"
			},
			options:{	
				type:Array
			}
		},
		data(){
			return{
				bShowMenu:false,
				menuOption:[]
			}
		},
		created(){
			this.selectLabel = this.$props.label;
			document.addEventListener("click",this.fnBlur,false)
		},
		beforeDestroy(){
			document.removeEventListener("click",this.fnBlur,false)
			this.$off("selectOption")
			this.$off("menuShow")
		},
		methods:{
			fnBlur(){
				if(this.$el&&!this.$el.contains(event.target)){
					this.bShowMenu = false;
				}			
			},
			selectItem(item,itemIndex){
				// this.selectLabel = item.label;
				this.$emit("selectOption",item)
				this.bShowMenu = false;
			},
			showMenu(){
				if(this.$props.options.length===0)return;
				this.bShowMenu = !this.bShowMenu;
			}
		},
		watch:{
			bShowMenu(newV,olcV){
				this.$emit("menuShow",newV)
			},
			"$props.label":{
				handler(newV,oldV){
					this.selectLabel = newV;
				}
			}
		}
	}
</script>
<style type="text/css">
	.custom-select{
		width:100%;
		line-height: 66px;
		position: relative;
	}
	.select-label-wrapper{
		width: 100%;
		display: flex;
    cursor: pointer;
	}
	.select-label {
    flex: 1;
    font-size: 20px;
    height: 100%;
    font-size: 27px;
    color: #393939;
		margin-left: 20px;
	}	
	.arrow-icon{
    font-size: 24px;
    line-height: 66px;	
    width: 66px;
    text-align: center;
    display: inline-block;
    font-weight: bold;
	}

	.select-menu{
    width: 100%;
    position: absolute;
    left: -1px;
    border: 1px solid gray;
    z-index: 2;
    background: #fff;
	}
	.select-menu-up{
		bottom:100%;
	}
	.select-menu-down{
		top:100%;
	}
	.select-menu-list{
		max-height: 540px;
		overflow-y: auto;
		padding-left: 20px;

	}
	.select-menu-list li.selected{
		color: #393939;
    font-weight: 700;
	}
	.select-menu-list li{
		line-height: 68px;
	  font-size: 27px;
	  color: #5f5f5f;	
	  cursor: pointer;	
	}
	.select-menu-list li+li{
		border-top:1px solid #e6e6e6;
	}


@media only screen and (min-width:1600px){
	.custom-select{
		line-height: 66px;
	}
	.select-label {
    font-size: 27px;
		margin-left: 20px;
	}		
	.arrow-icon{
    font-size: 24px;
    line-height: 66px;	
    width: 66px;		
	}	
}
@media only screen /* and (min-width:1080px) */ and (max-width:1600px){
	.custom-select{
		line-height: 50px;
	}
	.select-label {
    font-size: 20px;
    margin-left: 16px;
	}		

	.arrow-icon{
		font-size: 20px;
    width: 50px;
    line-height: 50px;	
	}

}

</style>