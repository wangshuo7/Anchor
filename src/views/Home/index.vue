<template>
  <session style="min-width: 876px">
    <div class="container" style="min-width: 800px">
      <div class="swiperbox">
        <swiper
          effect="fade"
          :fade="{ crossFade: true }"
          :slidesPerView="1"
          :spaceBetween="30"
          :loop="true"
          :centeredSlides="true"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :modules="modules"
          @swiper="onSwiper"
          :allowTouchMove="false"
          direction="horizontal"
          parallax
        >
          <swiper-slide
            v-for="(item, index) in Images"
            :key="index"
            class="slide"
          >
            <div :href="item.href" class="swiperbox-a">
              <el-image
                class="swiper-img"
                :src="item.swiper_src"
                :alt="item.alt"
              ></el-image>
            </div>
            <div class="swiperbox-content">
              <div class="info">
                <div
                  class="info-logo"
                  :data-swiper-parallax="-300"
                  :data-swiper-parallax-duration="600"
                >
                  <el-image
                    v-if="item.logo_src"
                    :src="item.logo_src"
                    :alt="item.alt"
                  ></el-image>
                </div>
                <div
                  class="info-time"
                  :data-swiper-parallax="-200"
                  :data-swiper-parallax-duration="400"
                  :data-swiper-parallax-opacity="0.5"
                >
                  {{ item.time }}
                </div>
                <div
                  class="info-discription"
                  :data-swiper-parallax="-200"
                  :data-swiper-parallax-duration="400"
                  :data-swiper-parallax-opacity="0.5"
                >
                  {{ item.discription }}
                </div>
              </div>
              <div class="buy" :data-swiper-parallax="-200">
                <span class="buy-price">{{ item.price }}</span>
                <div class="buttons">
                  <a class="buy-pay" href="#">立即购买</a>
                  <a class="buy-add" href="#">
                    <span>添至愿望清单</span>
                  </a>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <ul class="sidebox">
        <li
          class="side-item"
          v-for="(item, index) in Images"
          :key="index"
          @click="goToSlide(index)"
          :class="{ active: index === activeSlide }"
        >
          <a>
            <div class="side-mark" v-show="index === activeSlide"></div>
            <div class="side-img" :class="{ active: index === activeSlide }">
              <el-image class="img" :src="item.side_src"></el-image>
            </div>
            <div class="side-text">
              <p>{{ item.name }}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </session>
</template>

<script lang="ts">
export default {
  name: 'Home'
}
</script>
<script lang="ts" setup>
// import { onMounted } from 'vue'
import { getPersonalInfo } from '../../api/wallet'
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import {
  Autoplay,
  Navigation,
  Pagination,
  A11y,
  EffectFade,
  Parallax
} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
const modules = [Autoplay, Pagination, Navigation, A11y, EffectFade, Parallax]
const Images = ref<any>([
  {
    swiper_src: '/swiper/swiper1.jpg',
    href: '#',
    side_src: '/swiper/swiper-side1.webp',
    alt: 'Swiper 1',
    name: '《Return to Moria™》',
    time: '现已推出',
    discription: '独自一人或组队踏上冒险，夺回古老的摩瑞亚王国。',
    price: '￥128.00 起',
    logo_src: '/swiper/logo1.png'
  },
  {
    swiper_src: '/swiper/swiper2.jpg',
    side_src: '/swiper/swiper-side2.webp',
    alt: 'Swiper 2',
    name: '《Alan Wake 2》',
    time: '已推出',
    discription:
      '在这款来自 Remedy Entertainment 的最新心理惊悚游戏中，一系列仪式谋杀案正威胁着亮瀑镇。',
    price: '￥200.00 起',
    logo_src: '/swiper/logo2.png'
  },
  {
    swiper_src: '/swiper/swiper3.jpg',
    side_src: '/swiper/swiper-side3.webp',
    alt: 'Swiper 3',
    name: '《崩坏：星穹铁道》',
    time: '版本 1.5',
    discription: '“迷离幻夜谈”现已推出。',
    price: '免费',
    logo_src: '/swiper/logo3.png'
  },
  {
    swiper_src: '/swiper/swiper4.jpg',
    side_src: '/swiper/swiper-side4.webp',
    alt: 'Swiper 4',
    name: '《自杀小队：战胜正义联盟》数码豪华版',
    time: '2024 年 2 月 2 日即将推出',
    discription: '预购即可获得经典装束，以及提前72小时的抢先体验。',
    price: '￥522.00 起',
    logo_src: '/swiper/logo4.png'
  },
  {
    swiper_src: '/swiper/swiper5.jpg',
    side_src: '/swiper/swiper-side5.webp',
    alt: 'Swiper 5',
    name: '《Banishers: Ghosts of New Eden》',
    time: '将于 2 月 13 日推出',
    discription:
      '揭开瘆人的案件，和超自然的力量战斗。现在预购便可获得 Wanderer Set DLC。',
    price: '￥199.00 起',
    logo_src: ''
  },
  {
    swiper_src: '/swiper/swiper6.webp',
    side_src: '/swiper/swiper-side6.webp',
    alt: 'Swiper 6',
    name: '《Warhammer - Realms of Ruin》',
    time: '已推出',
    discription:
      '在这款以《Warhammer Age of Sigmar》为背景的既时策略游戏中，发动一场征服界域的残酷战争。',
    price: '￥198.00 起',
    logo_src: '/swiper/logo6.png'
  }
])
const theSwiper = ref<any>(null)
const onSwiper = (swiper: any) => {
  theSwiper.value = swiper as any
  // 监听Swiper的滑动事件，更新activeSlide的值
  swiper.on('slideChange', () => {
    activeSlide.value = swiper.realIndex // 使用 realIndex 获取当前实际幻灯片索引
  })
}
const isSideActive = ref<boolean>(false)
const activeSlide = ref<number>(0) // 初始时第一个为激活
// side 跳转
const goToSlide = (index: number) => {
  isSideActive.value = true
  theSwiper.value.slideToLoop(index)
  setTimeout(() => {
    isSideActive.value = false
  }, 300)
}

async function query() {
  await getPersonalInfo()
}
onMounted(() => {
  query()
})
</script>

<style lang="less" scoped>
/* 在屏幕宽度大于 2150 像素时应用的样式 */
@media screen and (min-width: 2151px) {
  .container {
    width: 100rem;
    position: relative;
    aspect-ratio: 800 / 369;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
  }

  .swiperbox {
    width: 82%;
    height: 100%;
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    .swiperbox-a {
      display: block;
      width: 100%;
      height: 100%;
      .swiper-img {
        width: 100%;
        height: 100%;
      }
    }
    .swiperbox-content {
      position: absolute;
      width: 24.39%;
      // width: 320px;
      height: 53.45%;
      // background: skyblue;
      bottom: 7.555%;
      left: 4.269%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: rgb(245, 245, 245);
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        .info-logo {
          height: 70%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .info-time {
          font-size: 12px;
          margin-bottom: 12px;
        }
        .info-discription {
          font-size: 18px;
        }
      }
      .buy {
        height: 20.18%;
        // background-color: firebrick;
        display: flex;
        flex-direction: column;
        .buy-price {
          font-size: 16px;
          color: rgb(245, 245, 245);
          margin-bottom: 10px;
        }
        .buttons {
          display: flex;
          a {
            width: 150px;
            height: 50px;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .buy-pay {
            background-color: #fff;
            color: #000;
            // border: 1px solid #000;
            border-radius: 4px;
          }
          .buy-add {
            margin-left: 15px;
            color: #fff;
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0);
            transition: background-color 0.3s ease;
          }
          .buy-add:hover {
            background-color: rgba(255, 255, 255, 0.2);
            // transition:
          }
        }
      }
    }
  }
  .sidebox {
    margin-left: 2%;
    flex: 1;
    // background-color: orange;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .side-item {
      width: 100%;
      height: 16.32%;
      list-style: none;
      border-radius: 20px; // 媒体查询
      position: relative;
      overflow: hidden;
      // background-color: red;
      .side-mark {
        width: 100%;
        height: 100%;
        position: absolute;
        left: -100%;
        background: rgba(187, 184, 184, 0.3);
        animation: move-right 5200ms linear;
      }
      @keyframes move-right {
        0% {
          left: -256px;
        }
        100% {
          left: 0;
        }
      }
      a {
        display: block;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .side-img {
        width: 23.4375%;
        // height: auto;
        margin: 0 5.86%;
        border-radius: 8px;
        overflow: hidden;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .side-img.active {
        animation: the-scale 300ms linear;
      }
      @keyframes the-scale {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      .side-text {
        width: 61%;
        // line-height: 26px; 媒体查询
        color: #333;
        z-index: 99;
      }
    }
    .side-item:hover {
      background-color: #ebebeb;
    }
    .side-item.active {
      background-color: #e6e6e6;
    }
  }
}
/* 在屏幕宽度在 1600 到 2150 像素之间时应用的样式 */
@media screen and (min-width: 1601px) and (max-width: 2150px) {
  .container {
    width: 80%;
    // min-height: 306.56px;
    // min-width: 720px;
    // max-width: 1600px;
    position: relative;
    aspect-ratio: 800 / 350;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
  }
  .swiperbox {
    width: 78%;
    height: 100%;
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    .swiperbox-a {
      display: block;
      width: 100%;
      height: 100%;
      .swiper-img {
        width: 100%;
        height: 100%;
      }
    }
    .swiperbox-content {
      position: absolute;
      width: 24.39%;
      // width: 320px;
      height: 53.45%;
      // background: skyblue;
      bottom: 7.555%;
      left: 4.269%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: rgb(245, 245, 245);
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        .info-logo {
          height: 70%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .info-time {
          font-size: 12px;
          margin-bottom: 12px;
        }
        .info-discription {
          font-size: 18px;
        }
      }
      .buy {
        height: 20.18%;
        // background-color: firebrick;
        display: flex;
        flex-direction: column;
        .buy-price {
          font-size: 16px;
          color: rgb(245, 245, 245);
          margin-bottom: 10px;
        }
        .buttons {
          display: flex;
          a {
            width: 150px;
            height: 50px;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .buy-pay {
            background-color: #fff;
            color: #000;
            // border: 1px solid #000;
            border-radius: 4px;
          }
          .buy-add {
            margin-left: 15px;
            color: #fff;
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0);
            transition: background-color 0.3s ease;
          }
          .buy-add:hover {
            background-color: rgba(255, 255, 255, 0.2);
            // transition:
          }
        }
      }
    }
  }
  .sidebox {
    margin-left: 2%;
    flex: 1;
    // background-color: orange;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .side-item {
      width: 100%;
      height: 16.32%;
      list-style: none;
      border-radius: 20px; // 媒体查询
      position: relative;
      overflow: hidden;
      // background-color: red;
      .side-mark {
        width: 100%;
        height: 100%;
        position: absolute;
        left: -100%;
        background: rgba(187, 184, 184, 0.3);
        animation: move-right 5200ms linear;
      }
      @keyframes move-right {
        0% {
          left: -256px;
        }
        100% {
          left: 0;
        }
      }
      a {
        display: block;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .side-img {
        width: 23.4375%;
        // height: auto;
        margin: 0 5.86%;
        border-radius: 8px;
        overflow: hidden;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .side-img.active {
        animation: the-scale 300ms linear;
      }
      @keyframes the-scale {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      .side-text {
        width: 61%;
        // line-height: 26px; 媒体查询
        color: #333;
        z-index: 99;
      }
    }
    .side-item:hover {
      background-color: #e6e6e6;
    }
    .side-item.active {
      background-color: #e6e6e6;
    }
  }
}
/* 在屏幕宽度在 1024 到 1600 像素之间时应用的样式 */
@media screen and (min-width: 1024px) and (max-width: 1600px) {
  // .side-item {
  //   border-radius: 15px;
  // }
  // .side-text {
  //   font-size: 14px;
  //   line-height: 16px;
  // }
  .container {
    width: 74%;
    // min-height: 306.56px;
    // min-width: 720px;
    // max-width: 1600px;
    position: relative;
    aspect-ratio: 1060 / 488;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
  }
  .swiperbox {
    width: 82%;
    height: 100%;
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    .swiperbox-a {
      display: block;
      width: 100%;
      height: 100%;
      .swiper-img {
        width: 100%;
        height: 100%;
      }
    }
    .swiperbox-content {
      // background: skyblue;
      position: absolute;
      width: 320px;
      height: 360px;
      bottom: 32px;
      left: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: rgb(245, 245, 245);
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        .info-logo {
          width: 260px;
          height: 160px;
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          .el-image {
            width: 100%;
            // height: 100%;
          }
        }

        .info-time {
          font-size: 12px;
          margin-bottom: 12px;
        }
        .info-discription {
          font-size: 18px;
          margin-bottom: 20px;
          height: 60px;
        }
      }
      .buy {
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .buy-price {
          font-size: 16px;
          color: rgb(245, 245, 245);
          // margin-bottom: 10px;
        }
        .buttons {
          display: flex;
          a {
            width: 150px;
            height: 50px;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .buy-pay {
            background-color: #fff;
            color: #000;
            // border: 1px solid #000;
            border-radius: 4px;
          }
          .buy-add {
            margin-left: 15px;
            color: #fff;
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0);
            transition: background-color 0.3s ease;
          }
          .buy-add:hover {
            background-color: rgba(255, 255, 255, 0.2);
            // transition:
          }
        }
      }
    }
  }
  .sidebox {
    margin-left: 2%;
    flex: 1;
    // background-color: orange;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .side-item {
      width: 100%;
      height: 16.32%;
      list-style: none;
      border-radius: 10px; // 媒体查询
      position: relative;
      overflow: hidden;
      // background-color: red;
      .side-mark {
        width: 100%;
        height: 100%;
        position: absolute;
        left: -100%;
        background: rgba(187, 184, 184, 0.3);
        animation: move-right 5200ms linear;
      }
      @keyframes move-right {
        0% {
          left: -256px;
        }
        100% {
          left: 0;
        }
      }
      a {
        display: block;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .side-img {
        width: 20%;
        // height: auto;
        margin: 0 5.86%;
        border-radius: 8px;
        overflow: hidden;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .side-img.active {
        animation: the-scale 300ms linear;
      }
      @keyframes the-scale {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      .side-text {
        width: 65%;
        line-height: 24px;
        font-size: 14px;
        color: #333;
        z-index: 99;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2; /* 控制显示的行数，根据实际需要调整 */
        text-overflow: ellipsis;
      }
    }
    .side-item:hover {
      background-color: #e6e6e6;
    }
    .side-item.active {
      background-color: #e6e6e6;
    }
  }
}
/* 在屏幕宽度在 768 到 1023 像素之间时应用的样式 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  // .side-item {
  //   border-radius: 10px;
  // }
  // .side-text {
  //   font-size: 10px;
  //   line-height: 12px;
  // }
  .container {
    width: 95%;
    // min-height: 306.56px;
    // min-width: 720px;
    // max-width: 1600px;
    position: relative;
    aspect-ratio: 976 / 450;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
  }
  .swiperbox {
    width: 82%;
    height: 100%;
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    .swiperbox-a {
      display: block;
      width: 100%;
      height: 100%;
      .swiper-img {
        width: 100%;
        height: 100%;
      }
    }
    .swiperbox-content {
      // background: skyblue;
      position: absolute;
      width: 320px;
      height: 300px;
      bottom: 32px;
      left: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: rgb(245, 245, 245);
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        .info-logo {
          width: 150px;
          height: 55px;
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          .el-image {
            width: 100%;
            // height: 100%;
          }
        }

        .info-time {
          font-size: 12px;
          margin-bottom: 12px;
        }
        .info-discription {
          font-size: 18px;
          margin-bottom: 20px;
          height: 60px;
        }
      }
      .buy {
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .buy-price {
          font-size: 16px;
          color: rgb(245, 245, 245);
          // margin-bottom: 10px;
        }
        .buttons {
          display: flex;
          a {
            width: 150px;
            height: 50px;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .buy-pay {
            background-color: #fff;
            color: #000;
            // border: 1px solid #000;
            border-radius: 4px;
          }
          .buy-add {
            margin-left: 15px;
            color: #fff;
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0);
            transition: background-color 0.3s ease;
          }
          .buy-add:hover {
            background-color: rgba(255, 255, 255, 0.2);
            // transition:
          }
        }
      }
    }
  }
  .sidebox {
    margin-left: 2%;
    flex: 1;
    // background-color: orange;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .side-item {
      width: 100%;
      height: 16.32%;
      list-style: none;
      border-radius: 10px; // 媒体查询
      position: relative;
      overflow: hidden;
      // background-color: red;
      .side-mark {
        width: 100%;
        height: 100%;
        position: absolute;
        left: -100%;
        background: rgba(187, 184, 184, 0.3);
        animation: move-right 5200ms linear;
      }
      @keyframes move-right {
        0% {
          left: -256px;
        }
        100% {
          left: 0;
        }
      }
      a {
        display: block;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .side-img {
        width: 20%;
        // height: auto;
        margin: 0 5.86%;
        border-radius: 8px;
        overflow: hidden;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .side-img.active {
        animation: the-scale 300ms linear;
      }
      @keyframes the-scale {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      .side-text {
        width: 65%;
        line-height: 16px;
        font-size: 12px;
        color: #333;
        z-index: 99;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2; /* 控制显示的行数，根据实际需要调整 */
        text-overflow: ellipsis;
      }
    }
    .side-item:hover {
      background-color: #e6e6e6;
    }
    .side-item.active {
      background-color: #e6e6e6;
    }
  }
}
/* 在屏幕宽度小于等于 768 像素时应用的样式 */
// @media screen and (max-width: 768px) {
//   .container {
//     width: 95%;
//     // min-height: 306.56px;
//     // min-width: 720px;
//     // max-width: 1600px;
//     position: relative;
//     aspect-ratio: 976 / 450;
//     margin: 0 auto;
//     overflow: hidden;
//     display: flex;
//   }
//   .swiperbox {
//     width: 82%;
//     height: 100%;
//     position: relative;
//     border-radius: 15px;
//     overflow: hidden;
//     .swiperbox-a {
//       display: block;
//       width: 100%;
//       height: 100%;
//       .swiper-img {
//         width: 100%;
//         height: 100%;
//       }
//     }
//     .swiperbox-content {
//       // background: skyblue;
//       position: absolute;
//       width: 320px;
//       height: 300px;
//       bottom: 32px;
//       left: 32px;
//       display: flex;
//       flex-direction: column;
//       justify-content: space-between;
//       color: rgb(245, 245, 245);
//       .info {
//         flex: 1;
//         display: flex;
//         flex-direction: column;
//         .info-logo {
//           width: 100px;
//           height: 25px;
//           margin-bottom: 20px;
//           display: none;
//           // display: flex;
//           justify-content: center;
//           align-items: center;
//           .el-image {
//             width: 100%;
//             // height: 100%;
//           }
//         }

//         .info-time {
//           font-size: 12px;
//           margin-bottom: 12px;
//           display: none; //
//         }
//         .info-discription {
//           display: none; //
//           font-size: 18px;
//           margin-bottom: 20px;
//           height: 60px;
//         }
//       }
//       .buy {
//         height: 60px;
//         display: flex;
//         flex-direction: column;
//         justify-content: space-between;
//         .buy-price {
//           font-size: 14px;
//           color: rgb(245, 245, 245);
//           // margin-bottom: 10px;
//         }
//         .buttons {
//           display: flex;
//           a {
//             width: 90px;
//             height: 30px;
//             font-size: 14px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//           }
//           .buy-pay {
//             background-color: #fff;
//             color: #000;
//             // border: 1px solid #000;
//             border-radius: 4px;
//           }
//           .buy-add {
//             margin-left: 15px;
//             color: #fff;
//             border-radius: 4px;
//             background-color: rgba(255, 255, 255, 0);
//             transition: background-color 0.3s ease;
//           }
//           .buy-add:hover {
//             background-color: rgba(255, 255, 255, 0.2);
//             // transition:
//           }
//         }
//       }
//     }
//   }
//   .sidebox {
//     margin-left: 2%;
//     flex: 1;
//     // background-color: orange;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
//     .side-item {
//       width: 100%;
//       height: 16.32%;
//       list-style: none;
//       border-radius: 10px; // 媒体查询
//       position: relative;
//       overflow: hidden;
//       // background-color: red;
//       .side-mark {
//         width: 100%;
//         height: 100%;
//         position: absolute;
//         left: -100%;
//         background: rgba(187, 184, 184, 0.3);
//         animation: move-right 5200ms linear;
//       }
//       @keyframes move-right {
//         0% {
//           left: -256px;
//         }
//         100% {
//           left: 0;
//         }
//       }
//       a {
//         display: block;
//         width: 100%;
//         height: 100%;
//         display: flex;
//         align-items: center;
//       }
//       .side-img {
//         width: 20%;
//         // height: auto;
//         margin: 0 5.86%;
//         border-radius: 8px;
//         overflow: hidden;
//         .img {
//           width: 100%;
//           height: 100%;
//         }
//       }
//       .side-img.active {
//         animation: the-scale 300ms linear;
//       }
//       @keyframes the-scale {
//         0% {
//           transform: scale(1);
//         }
//         50% {
//           transform: scale(1.1);
//         }
//         100% {
//           transform: scale(1);
//         }
//       }
//       .side-text {
//         width: 65%;
//         line-height: 16px;
//         font-size: 12px;
//         color: #333;
//         z-index: 99;
//         display: -webkit-box;
//         -webkit-box-orient: vertical;
//         overflow: hidden;
//         -webkit-line-clamp: 2; /* 控制显示的行数，根据实际需要调整 */
//         text-overflow: ellipsis;
//       }
//     }
//     .side-item:hover {
//       background-color: #e6e6e6;
//     }
//     .side-item.active {
//       background-color: #e6e6e6;
//     }
//   }
// }
</style>
