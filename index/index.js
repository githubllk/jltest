const App = getApp()

Page({
  data: {
    activeIndex: 0,
    navList: [],
    indicatorDots: !0,
    autoplay: !0,
    current: 0,
    interval: 3000,
    duration: 1000,
    circular: !0,
    catId: 1,
    prompt: {
      hidden: !0,
    },
  //   jhDataForTabbar:[//底部tabbar带角标
  //     {
  //   iCount: 1, //未读数目
  //   sIconUrl: "../template/img/note.png", //按钮图标
  //   sTitle: "note", //按钮名称
  // },
  // {
  //   iCount: 98, //未读数目
  //   sIconUrl: "../template/img/home.png", //按钮图标
  //   sTitle: "home", //按钮名称
  // },
  // {
  //   iCount: 0, //未读数目
  //   sIconUrl: "../template/img/safari.png", //按钮图标
  //   sTitle: "safari", //按钮名称
  // }],
  },
  showModal(message) {
    App.WxService.showModal({
      title: '友情提示',
      content: message,
      showCancel: !1,
    });
  },
  onLoad() {
    this.banner = App.HttpResource('/banner/:id', { id: '@id' })
    this.goods = App.HttpResource('/goods/:id', { id: '@id' })
    this.classify = App.HttpResource('/classify/:id', { id: '@id' })
    this.getBanners()
    this.getClassify()
    this.getScrol()
    this.getPromotion()//促销
  },
  initData() {
    const catId = this.catId || '1';
    const goods = {
      items: [],
      params: {
        table: 'content',
        page: 1,
        limit: 10,
        category_id: catId,
      },
      total: 1
    }

    this.setData({
      goods: goods
    })
  },
  navigateTo1(e) {
    App.WxService.navigateTo('/pages/goods/deile/deile', {
      goods_id: e.currentTarget.dataset.goods_id
    })
  },
  newfunTo(e) {
    wx.navigateTo({
      url: '../article/article?article_id=' + e.currentTarget.id,
    })
  },
  swiperchange(e) {
    //console.log(e.detail.current)
  },
  newchange(e) {
    // console.log(e)
  },
  search() {
    App.WxService.navigateTo('/pages/search/index')
  },
  getBanners() {
  
    //调用数据
    App.HttpService.getData({
      g: 'liteapp',
      m: 'banner',
      page: 1
    }).then(data => {
      if (data.code == 0) {
        data.data.forEach(n => n.path = App.renderImage(n.image));
        this.setData({
          images: data.data,
        })
      } else {
        this.showModal(data.message);
      }
    });
  },
  getClassify() {
    const activeIndex = this.activeIndex || 0;
    App.HttpService.getData({
      g: 'liteapp',
      m: 'banner',
      a: 'category'
    }).then(data => {
      this.setData({
        navList: data.data,
      });
      this.catId = data.data[activeIndex].id;
      this.onPullDownRefresh();
    });
  },
  getScrol() {
    App.HttpService.getData({
      g: 'liteapp',
      m: 'banner',
      a: 'bd'
    }).then(data => {
      data.data.forEach(n => n.image = App.renderImage(n.image));
      this.setData({
        scrollist: data.data,
      })
    })
  },
  getList() {
    const goods = this.data.goods;
    const params = goods.params;
    const total = goods.total;
    App.HttpService.getData(params).then(data => {
      data.data.forEach(n => n.thumb_url = App.renderImage(n.img));
      goods.total = data.total;
      goods.hasNext = goods.params.page <= data.totalPage;
      goods.params.page = goods.params.page + 1;
      goods.items = data.data;
      this.setData({
        goods: goods,
        'prompt.hidden': goods.hasNext
      });
    });

  },
  getPromotion(){
    App.HttpService.llkget("/liteapp/index/index",{}).then(data=>{
      data.data.goods.forEach(n => n.photo = App.renderImage("/attachs/" + n.photo));
      data.data.goods.forEach(n => n.price = App.formatMoney(n.price));
      data.data.goods.forEach( n => n.mall_price = App.formatMoney(n.mall_price));
      this.setData({
        pro:data.data.goods,
        news:data.data.news,
      })
    })
    this.setData({
      pro: [{
        src: App.Config.fileBasePath+"/attachs/2017/07/10/thumb_5962e2103bbfe.jpg",
        title: "标题标题",
        price: "23.4"
      }],
    })
    // console.log(src)
    // App.HttpService.addData({
    //       // src: ' 4444',
    // }) 
  },
  onPullDownRefresh() {
    console.info('onPullDownRefresh')
    this.initData()
    // this.getList()
  },
  onReachBottom() {
    console.info('onReachBottom')
    if (!this.data.goods.hasNext) return
    // this.getList()
  },
  onTapTag(e) {
    const catId = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const goods = {
      items: [],
      params: {
        table: 'content',
        page: 1,
        limit: 10,
        category_id: catId,
      },
      total: 1
    }
    this.setData({
      catId: catId,
      activeIndex: index,
      goods: goods,
    })
    // this.getList()
  },

  addCart(e) {
    const goods_id = e.currentTarget.dataset.id;
    App.HttpService.llkpost('/liteapp/cart/cartadd2', {
      goods_id: goods_id,
    }).then(data => {
      // if (data.code == 0) {
        // this.showToast(data.message)
        // setTimeout(function () {
        //   wx.reLaunch({
        //     url: '/pages/cart/cart'
        //   })
        // }, "3000")
        this.showModal(data.message);
      // }
    });
  },
})
