<template>
	<div class="custom-select" :class = "{'zIndex2': bShowMenu}">
		<div class="select-label-wrapper" :class = "{'disabled':options.length == 0}" @click = "showMenu">
			<span class="select-label">{{selectLabel}}</span>
			<span class="item-stock" 
					  :class = "{'stock-ab':subLabel > 0,'stock-unab':subLabel <= 0}"
					  v-show = "!bShowMenu && this.$props.label && subLabel != null">
						{{subLabel > 0 ? "available":"unavailable"}}
			</span>
			<!-- <i class= "arrow-icon icon-select-down_"></i> -->
			<i class= "icon-down arrow-icon"></i>
		</div>
		<div class="select-menu" :class = "{'select-menu-up':true,'select-menu-down':false}" v-show = "bShowMenu">
			<ul class="select-menu-list">
				<li v-for = "(item,itemIndex) in $props.options" @click = "selectItem(item,itemIndex)" :key = "itemIndex" :class = "{'selected': item.label == selectLabel}">
					<span class="item-size">{{item.label}}</span>  
					<span class="item-stock" 
								:class = "{'stock-ab':item.stock > 0,'stock-unab':item.stock <= 0}"
								v-if = "item.stock != null|| typeof item.stock == 'undefined'">
						{{item.stock > 0 ? "available":"unavailable"}}
					</span>
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
			subLabel:{
				type:Number
			},
			options:{	
				type:Array
			},
			lang:{
				type:String
			}
		},
		data(){
			return{
				bShowMenu:false,
				menuOption:[],
				selectLabel:null
			}
		},
		created(){
			// this.selectLabel = this.$props.label;
			if(!!this.$props.label){
				this.selectLabel = this.$props.label;
			}else{
				this.selectLabel = this.lang == "ZH"?"請選擇":"Please select";
			}
		
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
				this.bShowMenu = false;
				this.$emit("selectOption",item)
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
					if(!!newV){
						this.selectLabel = newV;
					}else{
						this.selectLabel = this.lang == "ZH"?"請選擇":"Please select";
					}				
				}
			}

		}
	}
</script>
<style type="text/css">

	.zIndex2{
		z-index: 2;
	}
	.custom-select{
		width:100%;
		position: relative;
    background-color: #ffffff;
    border: solid 1px #c8c8c8;
    display: inline-block;	
    line-height: 68px;
    height: 68px;
	}
	.select-label-wrapper{
		width: 100%;
    height: 100%;		
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
	.stock-ab {
	  color: #03c18d;
	}
	.stock-unab {
		color: #fe0000;
	}
	.item-stock {
		font-size: 20px;
    line-height: 68px;
    margin-right: 25px;
    float: right;
	}
	.arrow-icon{
    font-size: 24px;
    line-height: 66px;	
    height: 66px;	
    width: 66px;
    text-align: center;
    display: inline-block;
    color: #898989;
	}

	.select-menu{
    width: 100%;
    position: absolute;
    left: -1px;
    z-index: 2;
    background: #fff;
	  box-shadow: 0 -2px 6px 0 rgba(35, 35, 35, 0.2);
	  border: solid 1px #c8c8c8;    
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
		color: #c8c8c8;
	}
	.select-menu-list li{
    color: #5f5f5f;
    cursor: pointer;
    font-size: 26px;
	}
	.select-menu-list li+li{
		border-top:1px solid #e6e6e6;
	}

	.select-label-wrapper.disabled{
		cursor: not-allowed;
		background-color: #c8c8c8;
	}
	.icon-select-down_{
		background: url(../../assets/svg/ico_list_bglight_arrow_down_d.svg) no-repeat center center;
	}
/* @media only screen and (min-width:1600px){
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
	.select-menu-list li{
		line-height: 68px;
	  font-size: 27px;	  	
	}	
}
@media only screen  and (max-width:1600px){
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

	.select-menu-list li{
    line-height: 54px;
    font-size: 22px;	  	
	}	

} */

</style>