<template>
  <Row type="flex" justify="center" align="middle" class="login" @keydown.enter.native="submitLogin">
    <Col :xs="{span:22}" style="width: 368px;">
    <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>
    <Row class="login-form" v-if="!socialLogining">
        <Row type="flex" justify="space-between" class="code-row-bg">
            <h1 style="width: 100%; text-align:center; margin-bottom: 30px">违约数据查询系统</h1>
        </Row>
          <Form ref="usernameLoginForm" :model="form" :rules="rules" class="form">
            <FormItem prop="username">
              <Input v-model="form.username" prefix="ios-contact" size="large" clearable placeholder="请输入用户名" autocomplete="off" />
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" prefix="ios-lock" size="large" clearable placeholder="请输入密码" autocomplete="off" />
            </FormItem>
          </Form>
      <Row type="flex" justify="space-between" class="code-row-bg">
        <Checkbox v-model="saveLogin" size="large">自动登录</Checkbox>
      </Row>
      <Row>
        <Button class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
                            <span v-if="!loading">登录</span>
                            <span v-else>登录中...</span>
                        </Button>
      </Row>
    </Row>
    </Col>
  </Row>
</template>

<script>
import Cookies from "js-cookie";
import util from '~/libs/util';
export default {
  data() {
    const validatephone = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      socialLogining: false,
      error: false,
      errorMsg: "",
      tabName: "username",
      saveLogin: true,
      loading: false,
      sending: false,
      sended: false,
      count: 60,
      countButton: "60 s",
      maxLength: 6,
      errorCode: "",
      form: {
        username: "",
        password: "",
        phone: "",
        code: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur"
          },
          {
            validator: validatephone,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    showErrorMsg(msg) {
      this.error = true;
      this.errorMsg = msg;
    },
    sendVerify() {
      this.$refs.phoneLoginForm.validate(valid => {
        if (valid) {
          this.showErrorMsg("请捐赠获取完整版")
        }
      });
    },
    countDown() {
      let that = this;
      if (this.count === 0) {
        this.sended = false;
        this.count = 60;
        return;
      } else {
        this.countButton = this.count + " s";
        this.count--;
      }
      setTimeout(function() {
        that.countDown();
      }, 1000);
    },
    submitLogin() {
      if (this.tabName === "username") {
        this.$refs.usernameLoginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$axios.api.login({
              username: this.form.username,
              password: this.form.password,
              saveLogin: this.saveLogin
            }).then(res => {
              if (res.message === 'success') {
                this.$store.commit("setToken", res.data.access_token);
                if (this.saveLogin) {
                    Cookies.set("access_token", res.data.access_token, {
                      expires: 7
                    });
                }
                // 获取用户信息
                this.$axios.api.userInfo().then(res => {
                  if (res.message ===  'success') {
                    this.$store.commit('setInfo', res.data);
                    this.$axios.api.getMenuList().then(res => {
                        let menuData = res.data || [];
                        const constRoutes = [];
                        util.initRouterNode(constRoutes, menuData);
                        this.$store.commit('setMenulist', constRoutes.filter(item => item.children.length > 0));

                        let tagsList = [];
                        this.$store.state.app.routers.map((item) => {
                            if (item.children.length <= 1) {
                                tagsList.push(item.children[0]);
                            } else {
                                tagsList.push(...item.children);
                            }
                        });
                        this.$store.commit('setTagsList', tagsList);
                        this.$router.push({ path: "/business/home" })
                    });
                  } else {
                    this.loading = false;
                  }
                });
              } else {
                this.loading = false;
              }
            });
          }
        });
      }
    },
    handleDropDown(v) {
      if (v == "showAccount") {
        this.showAccount();
      } else if (v == "resetByphone") {
        this.showErrorMsg("请捐赠获取完整版")
      } else if (v == "resetByEmail") {
        this.showErrorMsg("请捐赠获取完整版")
      }
    },
  },
};
</script>

<style lang="less" scoped>
    .login {
    height: 100vh;
    background: url('~assets/background.svg');
    .header {
        margin-top: 9vh;
        margin-bottom: 6vh;
        text-align: center;
        .description {
            font-size: 14px;
            color: rgba(0, 0, 0, .45);
            margin-top: 1vh;
        }
    }
    .login-form {
        margin-bottom: 16vh;
    }
    .ivu-tabs-nav-container {
        line-height: 2;
        font-size: 17px;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        position: relative;
        zoom: 1;
    }
    .form {
        padding-top: 1vh;
        .input-verify {
            width: 70%;
        }
        .count-verify,
        .send-verify {
            width: 100px;
        }
    }
    .forget-pass,
    .other-way {
        font-size: 14px;
    }
    .login-btn,
    .other-login {
        margin-top: 3vh;
    }
    .icons {
        display: flex;
        align-items: center;
    }
    .other-icon {
        cursor: pointer;
        margin-left: 10px;
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, .2);
        :hover {
            color: #2d8cf0;
        }
    }
    .foot {
        margin-bottom: 2vh;
        color: rgba(0, 0, 0, .45);
        font-size: 14px;
        .help {
            margin: 0 auto;
            margin-bottom: 1vh;
            width: 60%;
            .item {
                color: rgba(0, 0, 0, .45);
            }
            :hover {
                color: rgba(0, 0, 0, .65);
            }
        }
    }
}

.ivu-tabs-nav .ivu-tabs-tab .ivu-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    margin-bottom: 5px;
}
</style>