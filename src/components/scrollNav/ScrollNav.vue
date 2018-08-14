<template>
    <div class="scrollnav" ref="scrollnavContainer">
        <div class="scrollnav-tab" ref="navbox">
            <ul class="scrollnav-tab-item" ref="nav" id = "scrollnavTab">
                <li 
                    v-for="(item, i) in navList" 
                    :key="i"
                    class="tab-item-li" 
                    :class="activeIndex === i  ? 'scrollnav-current' : ''"
                    :ref="'navitem_' + i"
                    @click="scrollToTargetContent(i)"
                >
                    <span :id = "item.id" :class = "{'active-tab-item':activeIndex === i}">{{item.label[lang]}}</span>
                </li>
            </ul>
        </div>
        <div class="scrollnav-content" id = "ScrollnavContent" ref="scrollView">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {scrollTop} from './utils/tool.js';

    export default {
        name: 'scrollnav',
        data() {
            return {
                lang:null,
                activeIndex: this.index,
                navList: [],
                currentOffset: 0,
                currentPosition: 0,
                scrolling: false,
            }
        },
        props: {
            index: {  //nav item index
                validator(val) {
                    return /^(([1-9]\d*)|0)$/.test(val);
                },
                default: 0
            },
            callback: {
                type: Function
            }
        },
        watch: {
            index(index) {
                this.activeIndex = index;
                this.scrollToTargetContent(index);
            }
        },
        methods: {
            init() {
                this.scrollView = this.$refs.scrollView;

                this.contentOffsetTop = this.scrollView.getBoundingClientRect().top;

                this.calculateWidth();
                this.scrollView.addEventListener('scroll', this.scrollHandler);
                window.addEventListener('resize', this.scrollHandler);
                window.addEventListener('resize',this.calculateWidth)

                //scroll to the index specified
                if (this.index > 0)this.scrollToTargetContent(this.index, false);
            },
            calculateWidth(){
                let width = this.$refs.scrollnavContainer.clientWidth;
                if(width < 320 )return;
                this.$refs.scrollView.style.width = width + 20  + "px";            
            },
            addItem(panel) {
                this.navList.push(panel);
            },

            getPanels() {
                return this.$children.filter(item => {
                    return item.$options.name === 'scrollnav-panel'
                });
            },
            scrollHandler() {
                if (this.scrolling) return;

                const panels = this.panels;
                let scrollBoxHeight = this.scrollView.offsetHeight;

                let activeIndex = null;
                panels.forEach((panel, index) => {
                    if (panel.$el.getBoundingClientRect().top <= scrollBoxHeight/2 + this.contentOffsetTop) {
                           activeIndex = index;
                    }
                });

                if(activeIndex != this.activeIndex){
                    this.activeIndex  = activeIndex;
                   this.scrollToTargetContent(this.activeIndex,false); 
                   this.$emit("activeIndexChanged",this.activeIndex);

                }

            },
            scrollToTargetContent(index, animate = true) {
                // debugger
                this.activeIndex = index;
                this.$emit("activeIndexChanged",this.activeIndex);
                this.scrolling = true;

                const panel = this.panels[index].$el;
                const speed = animate && (window.navigator && window.navigator.userAgent || '').indexOf('MicroMessenger') < 0 ? 500 : 0;

                scrollTop(this.scrollView, this.currentPosition, panel.offsetTop, speed, () => {
                    this.scrolling = false;
                });

                this.currentPosition = panel.offsetTop;

            },

        },
        mounted() {
            this.$nextTick(()=>{
                this.init();
                this.panels = this.getPanels();
            });
        },

        beforeDestroy() {
            this.scrollView.removeEventListener('scroll', this.scrollHandler);
            window.removeEventListener('resize',this.scrollHandler)
            window.removeEventListener('resize',this.calculateWidth)
            this.$off("activeIndexChanged")
        }
    }
</script>

<style>
    .scrollnav {
        width: 100%;
        display: flex;
        color: #898989;
        flex-direction: column;
        
        position: relative;
        overflow:hidden;
        height: 861px;
        margin-top: 96px;
    }

    .scrollnav-tab {
        position: absolute;
        z-index: 1;
    }

    .scrollnav-tab-item {
        padding: 0;
        margin: 0;
        flex: 1;
        list-style: none;
        border-left: 1px rgb(225,225,225) solid;
        padding-left: 10px;        
    }
    .tab-item-li {
        position: relative;
        cursor: pointer;
    } 
    .scrollnav-tab-item > li:first{
        padding-left: 0;
    }

    .scrollnav-tab-item > li.scrollnav-current {
        color: #393939;
        font-weight: bold;
    }
    .scrollnav-tab-item > li.scrollnav-current > i {
        width: 16px;
        height: inherit;
        position: absolute;
        top: 0;
        left: 0.5px;
        display: flex;
        align-items: center;
    }          

    .tab-item-li > span {
        margin-bottom: 20px;
        width: 100px;
        display: inline-block;   

    }
    .tab-item-li>span.active-tab-item:before{
        background-color: #393939;
    }
    .tab-item-li>span:before{
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 100%;
        display: inline-block;
        border: 2px solid #dfdfdf;
        position: absolute;
        left: -16px;
        top:20%;
        background-color: white;
        z-index: 1;
    }
    .tab-item-li>span.active-tab-item:before{
        border: 2px solid black;
    }

    .scrollnav-tab-item > li:first-child>span:after,
    .scrollnav-tab-item > li:last-child>span:after{
        width: 1px;
        display: inline-block;
        position: absolute;
        left: -11px;
        z-index: 1;
        content: "";
        height: 100%;
        background-color: #fafafa;
    }

    .scrollnav-tab-item > li:last-child>span:after{
        height: 100%;
    }
    .scrollnav-tab-item>li:first-child>span:after{
        height: 16px;
    }    
    .scrollnav-content {
        /*flex: 1;*/
        overflow-y: auto;
        overflow-x: hidden;
        position: absolute;
        top: 0;
        left: 0;
        height: 881px;        
    }


    .scrollnav-tab {
        bottom: 52px;
        right: 100px;  
        font-size: 20px;   
    }  
    
    .scrollnav-tab-item > li:first-child>span:after{
        top: -2px;
    }
    .scrollnav-tab-item > li:last-child>span:after{    
        top: 24px;
    }   
/*@media only screen and (min-width:1560px){
    .scrollnav {
        height: 798px;
        margin-top: 24px;       
    }

    .scrollnav-tab {
        bottom: 52px;
        right: 100px;  
        font-size: 20px;   
    }  
    
    .scrollnav-content {
        height: 798px;
        margin-left: 80px;
    }
    .scrollnav-tab-item > li:first-child>span:after{
        top: 0;
    }
    .scrollnav-tab-item > li:last-child>span:after{    
        top: 24px;
    }    
}
@media only screen and (max-width:1600px){
    .scrollnav {
        height: 600px;;
        margin-top: 18px;   
    }

    .scrollnav-content {
        height: 600px;
        margin-left: 58px;
    }
    .scrollnav-tab-item > li:first-child>span:after{
        top:-2px;
        top: -50px;
    }
    .scrollnav-tab-item > li:last-child>span:after{    
        top: 22px;
    }    

}

@media only screen and (min-width:1080px) and (max-width:1600px){
    .scrollnav-tab {
        font-size: 14px;
        bottom: 42px;
        right: 80px;  
    }   
}
@media only screen and (max-width:1080px){
    .scrollnav-tab {
        font-size: 14px;
        bottom: 42px;
        right: 64px;  
    }   
} */
</style>
