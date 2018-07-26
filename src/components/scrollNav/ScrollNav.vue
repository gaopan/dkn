<template>
    <div class="scrollnav">
        <div class="scrollnav-tab" ref="navbox">
            <ul class="scrollnav-tab-item" ref="nav">
                <li 
                    v-for="(item, i) in navList" 
                    :key="i"
                    class="tab-item-li" 
                    :class="activeIndex === i  ? 'scrollnav-current' : ''"
                    :ref="'navitem_' + i"
                    @click.stop="scrollToTargetContent(i)"
                >
                    <span :class = "{'active-tab-item':activeIndex === i}">{{item.label}}</span>
                </li>
            </ul>
        </div>
        <div class="scrollnav-content" ref="scrollView">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {isColor, scrollTop} from './utils/tool.js';

    export default {
        name: 'scrollnav',
        data() {
            return {
                activeIndex: this.index,
                navList: [],
                currentOffset: 0,
                currentPosition: 0,
                scrolling: false
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
            activeIndex(val) {       
                this.scrollToTargetContent(this.activeIndex,false);     
                this.$emit("activeIndexChanged",this.activeIndex);
            },
            index(index) {
                this.activeIndex = index;
                this.scrollToTargetContent(index);
            }
        },
        methods: {
            init() {
                this.scrollView = this.$refs.scrollView;

                this.contentOffsetTop = this.scrollView.getBoundingClientRect().top;

                this.scrollView.addEventListener('scroll', this.scrollHandler);
                // window.addEventListener('resize', this.scrollHandler);

                //scroll to the index specified
                if (this.index > 0)this.scrollToTargetContent(this.index, false);
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
                const scrollBox = this.scrollView;

                //prevent to scroll out of scroll content
                if (scrollBox.scrollTop >= panels[0].$el.offsetHeight * panels.length - scrollBox.offsetHeight) {
                    this.activeIndex = panels.length - 1;
                    return;
                }

                panels.forEach((panel, index) => {
                    if (panel.$el.getBoundingClientRect().top <= 100 + this.contentOffsetTop) {
                        this.activeIndex = index;
                    }
                });
            },
            scrollToTargetContent(index, animate = true) {
                // debugger
                this.activeIndex = index;
                this.scrolling = true;

                // const panel = this.getPanels()[index].$el;
                const panel = this.panels[index].$el;
                const speed = animate && (window.navigator && window.navigator.userAgent || '').indexOf('MicroMessenger') < 0 ? 500 : 0;

                scrollTop(this.scrollView, this.currentPosition, panel.offsetTop, speed, () => {
                    this.scrolling = false;
                });

                this.currentPosition = panel.offsetTop;
            }
        },
        mounted() {
            this.$nextTick(this.init);
            this.panels = this.getPanels();
        },
        beforeDestroy() {
            this.scrollView.removeEventListener('scroll', this.scrollHandler);
            // window.removeEventListener('resize', this.scrollHandler);
            this.$off("activeIndexChanged")
        }
    }
</script>

<style>
    .scrollnav {
        position: absolute;
        top: 200px;
        height: 844px;
        width: 100%;
        display: flex;
        color: #898989;
        flex-direction: column;
    }
    .scrollnav ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    .scrollnav-tab {
        /* display: flex; */
        position: absolute;
        bottom: 52px;
        right: 100px;  
        font-size: 20px;   
    }
    .scrollnav-tab-item {
        -webkit-overflow-scrolling: touch;
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
    .scrollnav-tab-item > li:first-child>span:after{
        top: -56px;
    }
    .scrollnav-tab-item > li:last-child>span:after{    
        top: 25px;
    }
    
    .scrollnav-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        margin-left: 80px;
    }

</style>
