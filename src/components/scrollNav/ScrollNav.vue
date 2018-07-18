<template>
    <div class="scrollnav">
        <div class="scrollnav-tab" ref="navbox">
            <!-- <div class="scrollnav-unfold" :class="toggle ? 'scrollnav-unfold-active' : ''">
                <div class="scrollnav-unfold-header" :style="{height: height, borderColor: borderColor}">
                    <div v-html="toggleText" :style="{backgroundColor: bgcolor}"></div>
                    <span></span>
                </div>
                <ul :style="{color: currentColor, backgroundColor: bgcolor}">
                    <li :style="{color: color}"
                        v-for="item, i in navList" :key="i"
                        @click.stop="scrollContent(i)"
                        :class="activeIndex === i ? 'scrollnav-current' : ''"
                    >{{item.label}}
                    </li>
                </ul>
            </div> -->
            <ul class="scrollnav-tab-item" ref="nav">
                <li 
                    v-for="(item, i) in navList" 
                    :style="{borderBottom: activeIndex === i ? currentColor : 'none'}"
                    :key="i"
                    :class="activeIndex === i  ? 'scrollnav-current' : ''"
                    :ref="'navitem_' + i"
                    @click.stop="scrollContent(i)"
                ><span>{{item.label}}</span>
                </li>
            </ul>
            <!-- <div class="scrollnav-toggle" :class="toggle ? 'scrollnav-toggle-active' : ''"
                 @click="toggle = !toggle"></div> -->
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
            index: {
                validator(val) {
                    return /^(([1-9]\d*)|0)$/.test(val);
                },
                default: 0
            },
            currentColor: {
                default: '2px solid rgb(20,21,131)'
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
                this.scrollNav(this.navList[val]._uid);
            },
            index(index) {
                this.activeIndex = index;
                this.scrollContent(index);
            }
        },
        methods: {
            init() {
                this.scrollView = this.$refs.scrollView;

                this.contentOffsetTop = this.scrollView.getBoundingClientRect().top;

                this.bindEvent();

                if (this.index > 0) {
                    this.scrollNav(this.navList[this.index]._uid, false);
                    this.scrollContent(this.index, false);
                }
            },
            addItem(panel) {
                this.navList.push(panel);
            },
            bindEvent() {
                this.scrollView.addEventListener('scroll', this.scrollHandler);
                window.addEventListener('resize', this.scrollHandler);
            },
            getPanels() {
                return this.$children.filter(item => item.$options.name === 'scrollnav-panel');
            },
            scrollHandler() {
                if (this.scrolling) return;

                const panels = this.getPanels();
                const panelsLength = panels.length;
                const scrollBox = this.scrollView;

                if (scrollBox.scrollTop >= panels[0].$el.offsetHeight * panelsLength - scrollBox.offsetHeight) {
                    this.activeIndex = panelsLength - 1;
                    return;
                }

                panels.forEach((panel, index) => {
                    if (panel.$el.getBoundingClientRect().top <= scrollBox.offsetHeight / 2 + this.contentOffsetTop) {
                        this.activeIndex = index;
                    }
                });
            },
            scrollNav(_uid, animate = true) {
                const navWidth = ~~this.$refs.nav.offsetWidth / 2;

                this.navList.every((item, index) => {
                    if (item._uid === _uid) {
                        const navitem = this.$refs['navitem_' + index][0];
                        const scrollOffset = navitem.offsetLeft - navWidth + navitem.offsetWidth / 2;

                        this.scrollLeft(this.currentOffset, scrollOffset, animate, () => {
                            this.callback && this.callback(index);
                        });
                        return false;
                    }
                    return true;
                });
            },
            scrollContent(index, animate = true) {
                this.toggle = false;
                this.activeIndex = index;
                this.scrolling = true;

                const panel = this.getPanels()[index].$el;
                const speed = animate && (window.navigator && window.navigator.userAgent || '').indexOf('MicroMessenger') < 0 ? 500 : 0;

                scrollTop(this.scrollView, this.currentPosition, panel.offsetTop - this.$refs.navbox.offsetHeight, speed, () => {
                    this.scrolling = false;
                });

                this.currentPosition = panel.offsetTop - this.$refs.navbox.offsetHeight;
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
        }
    }
</script>

<style>
    .scrollnav {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .scrollnav-tab {
        display: flex;
        position: relative;
        margin-bottom: 0.64rem;
    }
    .scrollnav-tab-item {
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        padding: 0;
        margin: 0;
        flex: 1;
        list-style: none;
    }
    .scrollnav-tab-item > li {
        line-height: 0.8rem;
        font-size: .28rem;
        display: inline-block;
        position: relative;
        cursor: pointer;
    } 
    .scrollnav-tab-item > li:first{
        padding-left: 0;
    }
    .scrollnav-tab-item li + li {
        margin-left: 0.8rem;
    }
    .scrollnav-tab-item > li.scrollnav-current {
        /* color: currentColor !important; */
        /* padding-left: .32rem; */
    }
    .scrollnav-tab-item > li.scrollnav-current > i {
        width: .32rem;
        height: inherit;
        position: absolute;
        top: 0;
        left: .5px;
        display: flex;
        align-items: center;
    }          
    /* .scrollnav-tab-item > li.scrollnav-current:before {
        content: '\E651';
        font-family: @iconfont-inlay;
        font-size: .32rem;
        line-height: 1;
    } */
    .scrollnav-tab-item > li > span {
        height: inherit;
        display: flex;
        align-items: center;
    }
    .scrollnav-toggle {
      width: 1rem;
      height: inherit;
      display: flex;
      align-items: center;
      justify-content: center;

    }
    .scrollnav-toggle:after {
        content: '\E68C';
        font-family: @iconfont-inlay;
        display: block;
        transform: rotate(0deg);
        transition: transform .08s linear;
        font-size: .32rem;
    }    
    .scrollnav-toggle-active:after {
        transform: rotate(180deg);
    }
    /* .scrollnav-unfold {
        position: absolute;
        z-index: 2;
        width: 100%;
        top: 0;
        pointer-events: none;
        opacity: 0;
        transform: translate(0, -100%);
        transition: all .08s linear;
    }
    .scrollnav-unfold-header {
        display: flex;
        align-items: center;
        position: relative;
        border-width: 0 0 1px 0;
        border-style: solid;
    }    
    .scrollnav-unfold-header > div {
        flex: 1;
        padding-left: .3rem;
        font-size: .28rem;
    }    
    .scrollnav-unfold-header > span {
      width: 1rem;
    }
    .scrollnav-unfold > ul {
        pointer-events: auto;
        overflow: hidden;
        padding-bottom: .2rem;
        padding-top: .2rem;
    }    
    .scrollnav-unfold > ul > li {
        float: left;
        width: 33.333%;
        padding-left: .3rem;
        line-height: .7rem;
        font-size: .28rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }   
    .scrollnav-unfold > ul > li.scrollnav-current {
        color: currentColor !important;
    }
    .scrollnav-unfold-active {
        opacity: 1;
        transform: translate(0, 0);
    } */
    .scrollnav-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
    }

</style>
