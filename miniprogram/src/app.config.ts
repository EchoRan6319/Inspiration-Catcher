export default defineAppConfig({
  pages: [
    'pages/capture/index',
    'pages/collection/index',
    'pages/detail/index',
    'pages/serendipity/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '灵感捕手',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#6b7280',
    selectedColor: '#7c3aed',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/capture/index',
        text: '灵感捕获',
        iconPath: 'assets/tabbar/add.png',
        selectedIconPath: 'assets/tabbar/add-active.png'
      },
      {
        pagePath: 'pages/collection/index',
        text: '灵感集',
        iconPath: 'assets/tabbar/collection.png',
        selectedIconPath: 'assets/tabbar/collection-active.png'
      }
    ]
  }
})
