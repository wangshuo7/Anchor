import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'zh', // 默认语言
  messages: {
    en: {
      // 面包屑
      home: 'Home',
      welcome: 'welcome',
      game: 'Game Management',
      mine: 'My Game',
      wallet: 'Wallet',
      live: 'Live Recording',
      info: 'Personal Information',
      recharge: 'Recharge Record',
      expend: 'Expend Record',
      card: 'Rechargeable Card',
      withdrawal: 'Withdrawal Application',
      transfer: 'Transfer Accounts',
      feedback: 'Feedback',
      'game/feedback': 'Feedback',
      form: {
        transfer: 'Transfer',
        yundou: 'Yun Dou',
        withdrawal: 'Withdrawal',
        card: 'Rechargeable card',
        form_label: {
          gameName: 'Game Name',
          sort: 'Sort'
        }
      },
      system: {
        logout: 'Log out'
      },
      table: {
        title: 'Title',
        remark: 'Remark',
        ctime: 'Create time',
        utime: 'Update time',
        operate: 'Operate',
        price: 'Yun Dou',
        num: 'Number',
        nickname: 'Nickname',
        phoneNumber: 'Phone number',
        withdrawalAccount: 'Withdrawal account'
      },
      button: {
        add: 'Add',
        edit: 'Edit',
        del: 'Delete',
        confirm: 'Confirm',
        cancel: 'Cancel',
        generate: 'Generate',
        set: 'Set',
        examine: 'Examine',
        save: 'Save',
        query: 'Query',
        clear: 'Clear',
        confirmOrder: 'Confirm Order'
      },
      message: {
        add: 'Add successfully',
        set: 'Setting successfully',
        del: 'Delete successfully'
      },
      placeholder: {
        transfer: 'Please enter the transfer ID',
        price: 'Please enter the YunDou number',
        withdrawal: 'Please enter the Withdrawal Yun Dou',
        card: 'Please enter the Rechargeable card',
        gameName: 'Please enter the Game name'
      },
      contextmenu: {
        reload: 'Reload',
        close: 'Close',
        closeOther: 'Close Others',
        closeRight: 'Close to the Right',
        closeLeft: 'Close to the Left',
        closeAll: 'Close All'
      },
      tooltip: {
        lightmode: 'Click to switch to LightMode',
        darkmode: 'Click to switch to DarkMode',
        enterfull: 'Click to enter full screen',
        leavefull: 'Click to exit full screen'
      },
      tips: {
        view: 'Click on the image to view details'
      }
    },
    zh: {
      home: '首页',
      welcome: '欢迎',
      game: '游戏管理',
      mine: '我的游戏',
      wallet: '钱包',
      live: '直播记录',
      info: '个人信息',
      recharge: '充值记录',
      expend: '消费记录',
      card: '充值卡',
      withdrawal: '提现申请',
      transfer: '转账',
      feedback: '反馈列表',
      form: {
        transfer: '转账',
        yundou: '云豆',
        withdrawal: '提现',
        card: '充值卡',
        form_label: {
          gameName: '游戏名称',
          sort: '排序'
        }
      },
      system: {
        logout: '退出登录'
      },
      table: {
        title: '标题',
        remark: '备注',
        ctime: '创建时间',
        utime: '更新时间',
        operate: '操作',
        price: '云豆',
        num: '数量',
        nickname: '昵称',
        phoneNumber: '手机号',
        withdrawalAccount: '提现账号'
      },
      button: {
        add: '添加',
        edit: '编辑',
        del: '删除',
        confirm: '确认',
        cancel: '取消',
        generate: '生成',
        set: '设置',
        examine: '审核',
        save: '保存',
        query: '查询',
        clear: '清空',
        confirmOrder: '确认订单'
      },
      message: {
        add: '添加成功',
        set: '设置成功',
        del: '删除成功'
      },
      placeholder: {
        transfer: '请输入转账ID',
        price: '请输入云豆数量',
        withdrawal: '请输入提现云豆',
        card: '请输入充值卡',
        gameName: '请输入游戏名称'
      },
      contextmenu: {
        reload: '重新加载',
        close: '关闭',
        closeOther: '关闭其他',
        closeRight: '关闭右侧',
        closeLeft: '关闭左侧',
        closeAll: '全部关闭'
      },
      tooltip: {
        lightmode: '点击切换亮色模式',
        darkmode: '点击切换暗黑模式',
        enterfull: '点击进入全屏',
        leavefull: '点击退出全屏'
      },
      tips: {
        view: '点击图片查看详情'
      }
    },
    tw: {
      home: '首頁',
      welcome: '歡迎',
      game: '遊戲管理',
      mine: '我的遊戲',
      wallet: '錢包',
      live: '直播記錄',
      info: '個人信息',
      recharge: '充值記錄',
      expend: '消費記錄',
      card: '充值卡',
      withdrawal: '提現申請',
      transfer: '轉賬',
      feedback: '反餽列表',
      form: {
        transfer: '轉賬',
        yundou: '雲豆',
        withdrawal: '提現',
        card: '充值卡',
        form_label: {
          gameName: '游戲名稱',
          sort: '排序'
        }
      },
      system: {
        logout: '退出登錄'
      },
      table: {
        title: '標題',
        remark: '备注',
        ctime: '創建時間',
        utime: '更新時間',
        operate: '操作',
        price: '雲豆',
        num: '數量',
        nickname: '暱稱',
        phoneNumber: '手機號',
        withdrawalAccount: '提現賬號'
      },
      button: {
        add: '添加',
        edit: '編輯',
        del: '刪除',
        confirm: '確認',
        cancel: '取消',
        generate: '生成',
        set: '設置',
        examine: '審核',
        save: '保存',
        query: '查詢',
        clear: '清空',
        confirmOrder: '確認訂單'
      },
      message: {
        add: '添加成功',
        set: '設置成功',
        del: '刪除成功'
      },
      placeholder: {
        transfer: '請輸入轉賬ID',
        price: '請輸入雲豆數量',
        withdrawal: '請輸入提現雲豆',
        card: '請輸入充值卡',
        gameName: '請輸入游戲名稱'
      },
      contextmenu: {
        reload: '重新加載',
        close: '關閉',
        closeOther: '關閉其他',
        closeRight: '關閉右側',
        closeLeft: '關閉左側',
        closeAll: '全部關閉'
      },
      tooltip: {
        lightmode: '點擊切換亮色模式',
        darkmode: '點擊切換暗黑模式',
        enterfull: '點擊進入全屏',
        leavefull: '點擊退出全屏'
      },
      tips: {
        view: '點擊圖片查看詳情'
      }
    }
    // 添加更多语言翻译
  }
})

export default i18n
