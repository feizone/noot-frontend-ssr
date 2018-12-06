<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="sidebar-menu-con menu-bar" :style="{width: shrink?'60px':'220px', overflow: shrink ? 'visible' : 'auto'}">
      <shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :theme="menuTheme" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
      </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'220px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                          <Icon type="md-menu" size="32"></Icon>
                      </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="hover" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ this.$store.state.user.info.username }}</span>
                  <Icon type="md-arrow-dropdown" />
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="changePass"> 修改密码 </DropdownItem>
                  <DropdownItem name="loginout"> 退出登录 </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'220px'}">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <nuxt></nuxt>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import shrinkableMenu from "~/components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "~/components/tags-page-opened.vue";
import breadcrumbNav from "~/components/breadcrumb-nav.vue";
import Cookies from "js-cookie";
import util from "~/libs/util.js";

export default {
    middleware: 'permission',
    layout: 'permission',
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
  },
  beforeCreate() {
      this.$store.commit('setCurrentPageName', this.$route.name);
  },
  data() {
    return {
      shrink: false,
      username: "",
      userId: "",
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr
    };
  },
  computed: {
      logout() {
          
      },
    menuList() {
      return this.$store.state.user.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    avatarPath() {
      return localStorage.avatorImgPath;
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    }
  },
  stompClient: {
    monitorIntervalTime: 100,
    stompReconnect: true,
    timeout(orgCmd) {}
  },
  methods: {
    init() {
      this.checkTag(this.$route.name);
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleLanDropdown(name) {
      localStorage.lang = name;
      this.$store.commit("switchLang", name);
    },
    handleClickUserDropdown(name) {
        if (name === 'changePass') {
            this.$router.push({ path: '/setting/password-reset' })
        } else if (name === "ownSpace") {
          this.$router.push({
            name: "ownspace_index"
          });
        } else if (name === "ownSpaceOld") {
          this.$router.push({
            name: "ownspace_old"
          });
        } else if (name === "loginout") {
          // 退出登录
          this.$store.commit("logout");
          this.$store.commit("removeMenuList");
          // 强制刷新页面 重新加载router
          location.reload();
        }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      // console.log(name)
      return true;
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    }
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less">
.lock-screen-back {
    border-radius: 50%;
    z-index: -1;
    box-shadow: 0 0 0 0 #667aa6 inset;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 3s;
}

.main {
    position: absolute;
    width: 100%;
    height: 100%;
    .unlock-con {
        width: 0px;
        height: 0px;
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 11000;
    }
    .sidebar-menu-con {
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 21;
        transition: width .3s; // background: rgb(73, 80, 96)
        background: #515a6e;
    }
    .layout-text {
        display: inline-block;
        white-space: nowrap;
        position: absolute;
    }
    .main-hide-text .layout-text {
        display: none;
    }
    &-content-container {
        position: relative;
    }
    &-header-con {
        box-sizing: border-box;
        position: fixed;
        display: block;
        padding-left: 200px;
        width: 100%;
        height: 100px;
        z-index: 20;
        box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);
        transition: padding .3s;
    }
    &-breadcrumb {
        padding: 8px 15px 0;
    }
    &-menu-left {
        background: #464c5b;
        height: 100%;
    }
    .tags-con {
        height: 40px;
        z-index: -1;
        overflow: hidden;
        background: #f0f0f0;
        .tags-outer-scroll-con {
            position: relative;
            box-sizing: border-box;
            padding-right: 120px;
            width: 100%;
            height: 100%;
            .tags-inner-scroll-body {
                position: absolute;
                padding: 2px 10px;
                overflow: visible;
                white-space: nowrap;
                transition: left .3s ease;
            }
            .close-all-tag-con {
                position: absolute;
                right: 0px;
                top: 0;
                box-sizing: border-box;
                padding-top: 8px;
                text-align: center;
                width: 110px;
                height: 100%;
                background: white;
                box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
                z-index: 10;
            }
        }
    }
    &-header {
        min-width: 710px;
        height: 60px;
        background: #fff;
        box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);
        position: relative;
        z-index: 11;
        .navicon-con {
            margin: 6px;
            display: inline-block;
        }
        .header-middle-con {
            position: absolute;
            left: 60px;
            top: 0;
            right: 340px;
            bottom: 0;
            padding: 10px;
            overflow: hidden;
        }
        .header-avator-con {
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 200px;
            .options {
                .ivu-select-dropdown {
                    transform-origin: center top 0px;
                    position: absolute;
                    top: 45px !important;
                    left: -2px;
                    will-change: top, left;
                }
            }
            .language {
                display: inline-block;
                width: 30px;
                padding: 18px 0;
                text-align: center;
                cursor: pointer;
                vertical-align: middle;
            }
            .switch-theme-con {
                display: inline-block;
                width: 40px;
                height: 100%;
            }
            .message-con {
                display: inline-block;
                width: 30px;
                padding: 18px 0;
                text-align: center;
                cursor: pointer;
                i {
                    vertical-align: middle;
                }
            }
            .change-skin {
                font-size: 14px;
                font-weight: 500;
                padding-right: 5px;
            }
            .switch-theme {
                height: 100%;
            }
            .user-dropdown {
                &-menu-con {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 135px;
                    height: 100%;
                    .main-user-name {
                        font-size: 14px;
                        display: inline-block;
                        width: 58px;
                        margin-right: 5px;
                        word-break: keep-all;
                        white-space: nowrap;
                        vertical-align: middle;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        text-align: right;
                    }
                }
                &-innercon {
                    height: 100%;
                    padding-right: 14px;
                }
            }
            .full-screen-btn-con {
                display: inline-block;
                width: 30px;
                padding: 18px 0;
                text-align: center;
                cursor: pointer;
                i {
                    vertical-align: middle;
                }
            }
            .lock-screen-btn-con {
                display: inline-block;
                width: 30px;
                padding: 18px 0;
                text-align: center;
                cursor: pointer;
                i {
                    vertical-align: middle;
                }
            }
        }
    }
    .single-page-con {
        min-width: 770px;
        position: absolute;
        top: 100px;
        right: 0;
        bottom: 0;
        overflow: auto;
        background-color: #F0F0F0;
        z-index: 1;
        transition: left .3s;
        .single-page {
            margin: 10px;
        }
    }
    &-copy {
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
}

.taglist-moving-animation-move {
    transition: transform .3s;
}

.logo-con {
    padding: 8px;
    text-align: center;
    img {
        height: 44px;
        width: auto;
    }
}

.menu-bar {
    overflow: auto;
    overflow-x: hidden;
}

.menu-bar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.menu-bar::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #c3c3c3;
}

.menu-bar::-webkit-scrollbar-track {
    background: #fff;
}
</style>
