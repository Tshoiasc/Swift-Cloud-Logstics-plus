## 插件说明

> 如果你需要胶囊,需要底部下划线 又同时支持NVUE,VUE,小程序 选我！不好用头剁下来,如果发现定位偏移,别慌,检查一下参数,参数提供的非常多,可随意调节！

## 使用说明

### 1、胶囊+Swiper联动用法(正常难度)

- 视图文件

```html
<template>
	<view style="flex: 1;">
		<per-tabs ref="tab" :tabs="tabs" :isScroll="false" v-model="tabIndex" @change="tabChanged" :tabImages="tabImages" tipType="pill"
				tipBgColor="rgba(0,0,0,0.3)">
		</per-tabs>
		<!--Swiper联动列子-->
		<swiper class="mySwiper" @transition="swiperTransition" @animationfinish="swiperAnimationfinish"
			:current="tabIndex" @change="swiperChange">
			<swiper-item v-for="(item,index) in tabs">
				<view style="flex-direction: column;flex: 1; align-items: center;justify-content: center;">
					<text>测试页{{index}}</text>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>
```

- 脚本文件

```js
export default {
		data() {
			return {
				swiperWidth: 0,
				tabIndex: 0,
				swiperIndex: 0,
				tabs: ["拼多多", '淘宝天猫国际', '京东'],
				//tab图片集合,注意修改成自己的图片地址,或者不给值
				tabImages: ['/static/image/login/login_mm_icon.png', '/static/image/login/login_mm_icon.png',
					'/static/image/login/login_mm_icon.png'
				]
			}
		},
		methods: {
			//tab值改变事件
			tabChanged(index) {
				//执行你的业务
			},
			//swiper滑动事件
			swiperTransition(e) {
				this.$refs.tab.swiperApter(e.detail.dx, this.swiperWidth, this.swiperIndex);
			},
			//swiper动画结算
			swiperAnimationfinish(e) {
				this.swiperIndex = this.tabIndex = e.detail.current;
			},
			////swiper值改变事件(必须写此方法,不然可能出现抖动)
			swiperChange(e) {
				console.log(e.detail.current);
			},
		},
		onLoad() {
			//获取Swiper宽度,根据自己页面写,我是全屏的
			this.swiperWidth = getApp().globalData.screenWidth;
		}
	}
```

### 2、基本滑动Tab(简单难度)

- 视图文件

```html
<per-tabs ref="tab" :tabs="tabs" :isScroll="true" v-model="tabIndex" @change="tabChanged"></per-tabs>
```

- 脚本文件

```js
export default {
  data() {
    return {
      tabIndex: 0,
	  tabs: ["拼多多", '淘宝天猫国际', '京东'],
    }
  }
}
```

### 3、Tab作为多级Swiper内部组件(进阶)
#### 注意:gid属性只适用于Swiper内部,并且tab展示的东西一样的时候适用,如swiper-item数量小于3个可用标准写法,超出3个就需要你自己变通一下啦
- 视图文件(主页面)
```html
        <template>
			<per-tabs ref="tab" :tabs="tabs" :isScroll="false" v-model="tabIndex" @change="tabChanged"
				:tabImages="tabImages" tipBgColor="#ffffff">
			</per-tabs>
			<!--最外部Swiper联动-->
		    <swiper class="mySwiper" @transition="swiperTransition" @animationfinish="swiperAnimationfinish"
			:current="tabIndex" @change="swiperChange">
			<swiper-item v-for="(item,index) in tabs" :key="index">
			     <!--salePaging为其他自定义组件,里面同样使用了Per-Tab-->
				<salePaging :index="index"></salePaging>
			</swiper-item>
		</swiper>
		</template>
```
- 视图文件(子组件 salePaging )
```html
  <template>
	<view class="salePaging">
		<view style="height: 80rpx;margin-top: 26rpx;">
			<per-tabs  gid="salePaging" :index="tabIndex" :pillTop="1" tipBgColor="#FF5000" normFontColor="#adadad"
				:pillPaddingLeft="6" :pillPaddingRight="6" :pillHeight="28" :tabs="catTabs" :isScroll="true"
				:autoInit="index==0" tipType="pill" @change="tabItemClick" ></per-tabs>
		</view>
	</view>
  </template>
```
- 脚本文件(子组件 salePaging )
```js
  export default {
		data() {
			return {
				catTabs: ['全部', '居家日用', '女装', '男装', '母婴', '美妆', '鞋品', '内衣', '配饰', '箱包', '数码家电', '家装家枋', '户外运动', '文娱车品'],
				tabIndex: 0,
				tabInnerData: [],
			}
		},
		props: {
			index: {
				type: Number,
				default: -1
			}
		},
		methods: {
			tabItemClick(i) {
				//执行你的业务
			},
		}
	}
```
## 文档说明

### 1、属性说明(由于兼容,暂不提供过滤动画时长属性,如需要修改,可重写css)

|       参数			|  类型		|  默认值			|                    说明																|
| :---------------:		| :-----:	| :-------:			| :----------------------------------------:											|
|    tipType			| String	|  'norm'			|   norm(底部滑线模式),pill(药丸胶囊模式)												|
|    tabs				| Array		|     []			|                tab文字数据源															|
|    tabImages			| Array		|     []			|                tab图片数据源															|
|    scrollStart		| Number	|     13			|                整个tab左边距															|
|    value				| Number	|     0				|                当前值(双向绑定)																|
|    tabPaddingLeft		| Boolean	|   '7px'			|                tabItem左内边距														|
|    tabPaddingRight	| String	|   '7px'			|                tabItem右内边距														|
|    tabPaddingTop		| String	|   '5px'			|                tabItem上内边距														|
|    tabPaddingBottom	| String	|   '5px'			|                tabItem下内边距														|
|    tabFontSize		| Number	|    15				|                tabItem文字大小														|
|    tabImageSize		| Number	|    20				|                tabImage图片大小														|
|    actFontColor		| String	|  '#ffffff'		|                选中时文字颜色															|
|    actFontBolder		| Boolean	|   true			|                选中时文字是否加粗														|
|    normFontColor		| String	|  '#ffffff'		|                普通文字颜色															|
|    tabBgColor			| String	|  'rgba(0,0,0,0)'	|                tab背景颜色															|
|    tipBgColor			| String	|  '#fffbfc'		|                指示器背景颜色(胶囊和底部共同使用,支持渐变)							|
|    pillTop			| Number	|    0				|                胶囊距离内部上边距(用到的地方很少,大部分可通过tabClass+itemPadding实现)|
|    pillRatio			| Number	|    30				|                胶囊圆率																|
|    pillHeight			| Number	|    30				|                胶囊高度																|
|    pillPaddingLeft	| Number	|    4				|                胶囊距离文字左边距														|
|    pillPaddingRight	| Number	|    4				|                胶囊距离文字右边距														|
|    isScroll			| Boolean	|    false			|                是否是滑动Tab															|
|    lineScale			| Number	|    0.5			|               底部滚动条比列(按tab内容大小为基数)										|
|    pid				| String	|    ''				|               Id(特殊业务下需要,普通可不设置,组件会自动生成)							|
|    gid				| String	|    ''				|               组Id(作为Swiper内部组件时,需要定义分组,属于进阶操作)					|
|    autoInit			| Boolean	|    true			|              是否自动初始化(作为Swiper内部组件时,只需要初始化第一个组员就可以了)		|

### 2、事件说明

|  名称  | 参数  |                说明                |
| :----: | :---: | :--------------------------------: |
| change | index | 改变选中项触发, index 选中项的下标 |

## 更新日志
### 2022-04-12

1:修复per-tab父布局有pading或者margin时计算错误Bug;
2:特别注意:属性绑定模式发生变化,由index属性绑定更改为双向绑定V-Model;
3:Per-tab现在支持VUE了;

### 2022-04-12

1. 增加pid属性,用于解决一个页面中多个per-tab导致的计算错误Bug.
2. 增加gid属性,用于解决per-tab作为swiper-item中的组件造成的计算错误Bug.
3. 增加autoInit属性,用于协助gid
4. 调整tabItem宽度指定范围,由整个item宽度变化为文字宽度

### 2022-04-11

1. 第一次发布,已过android8-12,Ios9-14测试。
 
**写在最后：**
欢迎各位朋友反馈 bug ，本人后端 C# 一枚，前端并不是特别精通,只因项目需要用NVUE，但是NVUE-TAB 控件市场上没有,所以写了一个来帮助大家。如果你在使用的过程中有什么不合理，需要优化的，都可以在下面评论（或加我 QQ: 837437923），本人看见后回复、修正，感谢。
 
## 预览

![per-tabs 1.0.3.gif](https://csdnresource.oss-cn-qingdao.aliyuncs.com/p1.gif)
![per-tabs 1.0.2.gif](https://csdnresource.oss-cn-qingdao.aliyuncs.com/p2.gif)
