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
                toggle: false,
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
            currentColor: {
                // default: '2px solid rgb(20,21,131)'
                default: 'black'
            },
            toggleText: {
                type: String,
                default: 'Toggle'
            },
            bgcolor: {
                validator(value) {
                    if (!value) return true;
                    return isColor(value);
                },
                default: '#FFF'
            },
            borderColor: {
                validator(value) {
                    if (!value) return true;
                    return isColor(value);
                },
                default: '#EFEFEF'
            },
            callback: {
                type: Function
            }
        },
        watch: {
            activeIndex(val) {
               
                // this.scrollNav(this.navList[val]._uid);
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
                window.addEventListener('resize', this.scrollHandler);

                //scroll to the index specified
                if (this.index > 0) {
                    // this.scrollNav(this.navList[this.index]._uid, false);
                    this.scrollToTargetContent(this.index, false);
                }
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

                const panels = this.getPanels();
                const panelsLength = panels.length;
                const scrollBox = this.scrollView;

                //prevent to scroll out of scroll content
                if (scrollBox.scrollTop >= panels[0].$el.offsetHeight * panelsLength - scrollBox.offsetHeight) {
                    this.activeIndex = panelsLength - 1;
                    return;
                }

                panels.forEach((panel, index) => {
                    if (panel.$el.getBoundingClientRect().top <= /*scrollBox.offsetHeight / 2*/100 + this.contentOffsetTop) {
                        // console.log(this.contentOffsetTop)
                        this.activeIndex = index;
                    }
                });
            },
            /*scrollNav(_uid, animate = true) {
                const navWidth = ~~this.$refs.nav.offsetWidth / 2;

                this.navList.every((item, index) => {
                    if (item._uid === _uid) {
                        debugger
                        const navitem = this.$refs['navitem_' + index][0];
                        const scrollOffset = navitem.offsetLeft - navWidth + navitem.offsetWidth / 2;

                        this.scrollLeft(this.currentOffset, scrollOffset, animate, () => {
                            this.callback && this.callback(index);
                        });
                        return false;
                    }
                    return true;
                });
            },*/
            scrollToTargetContent(index, animate = true) {
                // debugger
                this.toggle = false;
                this.activeIndex = index;
                this.scrolling = true;

                const panel = this.getPanels()[index].$el;
                const speed = animate && (window.navigator && window.navigator.userAgent || '').indexOf('MicroMessenger') < 0 ? 500 : 0;

                scrollTop(this.scrollView, this.currentPosition, panel.offsetTop, speed, () => {
                    this.scrolling = false;
                });

                this.currentPosition = panel.offsetTop;

                // console.log(this.currentPosition)
            },
            scrollLeft(from, to, animate, callback) {
                const difference = Math.abs(from - to);
                const step = animate ? Math.ceil(difference / 600 * 50) : difference;
                const self = this;

                function scroll(start, end, step) {
                    if (start === end) {
                        callback && callback();
                        return;
                    }

                    let d = (start + step > end) ? end : start + step;
                    if (start > end) {
                        d = (start - step < end) ? end : start - step;
                    }
                    self.$refs.nav.scrollLeft = d;
                    self.currentOffset = d;
                    window.requestAnimationFrame(() => scroll(d, end, step));
                }

                scroll(from, to, step);
            }
        },
        mounted() {
            this.$nextTick(this.init);
        },
        beforeDestroy() {
            this.scrollView.removeEventListener('scroll', this.scrollHandler);
            window.removeEventListener('resize', this.scrollHandler);
            this.$off("activeIndexChanged")
        }
    }
</script>

<style>
    .scrollnav {
        position: absolute;
        top: 3.98rem;
        left: 1.6rem;
        height: 100%;
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
        display: flex;
        position: absolute;
        bottom: 9.32rem;
        right: 2.8rem;  
        font-size: 0.4rem;   
    }
    .scrollnav-tab-item {
        -webkit-overflow-scrolling: touch;
        padding: 0;
        margin: 0;
        flex: 1;
        list-style: none;
        border-left: 0.02rem rgb(225,225,225) solid;
        padding-left: .2rem;        
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
        width: .32rem;
        height: inherit;
        position: absolute;
        top: 0;
        left: 0.01rem;
        display: flex;
        align-items: center;
    }          

    .tab-item-li > span {
        margin-bottom: 0.4rem;
        width: 2rem;
        display: inline-block;   

    }
    .tab-item-li>span.active-tab-item:before{
        background-color: #393939;
    }
    .tab-item-li>span:before{
        content: "";
        width: .12rem;
        height: .12rem;
        border-radius: 100%;
        display: inline-block;
        border: 0.04rem solid #dfdfdf;
        position: absolute;
        left: -0.32rem;
        background-color: white;
        z-index: 1;
    }
    .tab-item-li>span.active-tab-item:before{
        border: 0.04rem solid black;
    }
    .scrollnav-tab-item > li:last-child>span:after{
        width: 0.02rem;
        display: inline-block;
        position: absolute;
        left: -0.22rem;
        top: 0.2rem;
        z-index: 1;
        content: "";
        height: 100%;
        background-color: #fff;
    }


    .scrollnav-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
    }

</style>
