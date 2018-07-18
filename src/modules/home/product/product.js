import { Carousel,Slide } from "@/components/carousel"
import {ScrollNav, ScrollNavPanel} from "@/components/scrollNav"
import tree from "@/assets/picture/tree.jpg"
import beach from "@/assets/picture/beach.jpg"
import mountains from "@/assets/picture/mountains.jpg"

import tree1 from "@/assets/picture/tree1.jpg"
import beach1 from "@/assets/picture/beach1.jpg"
import mountains1 from "@/assets/picture/mountains1.jpg"

console.log(ScrollNav, ScrollNavPanel)
export default {
	name: 'product',
	props: {
		rfid: {
			// required: true
		}
	},
	data(){
		return{
			imageUrl:[tree,beach,mountains,tree1,beach1,mountains1],
			list: [
        {label: 'PRODUCT BENEFITS'},
        {label: 'TECHNICAL INFORMATION'},
        {label: 'COMPOSITION/ADVICE'},
        {label: 'RENEWS'}
      ]
		}
	},
	created(){
	},
	methods:{
		handleSlideClick(args){
			console.log(args)
		}
	},
	components:{
		Carousel,
		Slide,
		ScrollNav,
		ScrollNavPanel
	}
}