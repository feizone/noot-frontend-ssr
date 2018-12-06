<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row>
                        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
                            <Form-item label="姓名" prop="realname">
                              <Input type="text" v-model="searchForm.realname" clearable placeholder="请输入用户名" style="width: 150px"/>
                            </Form-item>
                            <Form-item label="身份证号" prop="idcard">
                              <Input type="text" v-model="searchForm.idcard" placeholder="输入身份证号" style="width: 350px"/>
                            </Form-item>
                            <Form-item style="margin-left:-35px;" class="br">
                              <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                            </Form-item>
                        </Form>
                    </Row>
                    <Row class="operation">
                        <Button @click="handleBatchDelete">批量删除</Button>
                    </Row>
                    <Row>
                        <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" ref="selection"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator ></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>

export default {
    layout: 'permission',
  name: "user-manage",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else {
        callback();
      }
    };
    const validatephone = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      } };
    return {
      accessToken: {},
      loading: false,
      operationLoading: false,
      modalExportAll: false,
      searchKey: "",
      searchForm: {
        realname: "",
        departmentId: "",
        phone: "",
        pageNumber: 1,
        pageSize: 10,
        sort: "created_at",
        order: "desc",
        startDate: "",
        endDate: ""
      },
      modalType: 0,
      submitLoading: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          type: "index",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "姓名",
          key: "realname",
          width: 100,
          sortable: true,
          fixed: "left"
        },
        {
          title: "身份证",
          key: "idcard",
          fixed: "left",
          width: 250
        },
        {
          title: "违约金额",
          key: "money",
          width: 100,
        },
        {
          title: "违约时间",
          key: "discredit_date",
          sortType: "desc",
          width: 200
        },
        {
          title: "数据提供者",
          key: "create_username",
          sortType: "desc",
          width: 100
        },
        {
          title: "操作",
          key: "action",
          sortType: "desc",
          width: 80,
          render: (h, params)=>{
            return h('div', [
                h('Button', {
                props: {
                    type: 'primary',
                    size: 'small'
                },
                style: {
                    marginRight: '5px'
                },
                on: {
                    click: () => {
                        this.handleDelete(params.row.id)
                    }
                }
                }, '删除')
            ])
          }
        }
      ],
      data: [],
      exportData: [],
      total: 0
    };
  },
  mounted() {
      this.getUserList(false, false, false);
  },
  methods: {
    initDepartmentData() {
      this.$axios.api.initDepartment().then(res => {
        if (res.message ===  'success') {
          res.data.forEach(function(e) {
            if (e.isParent) {
              e.value = e.id;
              e.label = e.title;
              e.loading = false;
              e.children = [];
            } else {
              e.value = e.id;
              e.label = e.title;
            }
            if (e.status === -1) {
              e.label = "[已禁用] " + e.label;
              e.disabled = true;
            }
          });
          this.department = res.data;
        }
      });
    },
    initDepartmentTreeData() {
      this.$axios.api.initDepartment().then(res => {
        if (res.message ===  'success') {
          res.data.forEach(function(e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status === -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          this.dataDep = res.data;
        }
      });
    },
    loadData(item, callback) {
      item.loading = true;
      this.$axios.api.loadDepartment(item.value).then(res => {
        item.loading = false;
        if (res.message ===  'success') {
          res.data.forEach(function(e) {
            if (e.isParent) {
              e.value = e.id;
              e.label = e.title;
              e.loading = false;
              e.children = [];
            } else {
              e.value = e.id;
              e.label = e.title;
            }
            if (e.status === -1) {
              e.label = "[已禁用] " + e.label;
              e.disabled = true;
            }
          });
          item.children = res.data;
          callback();
        }
      });
    },
    loadDataTree(item, callback) {
      this.$axios.api.loadDepartment(item.id).then(res => {
        if (res.message ===  'success') {
          res.data.forEach(function(e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status === -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          callback(res.data);
        }
      });
    },
    selectTree(v) {
      if (v.length > 0) {
        // 转换null为""
        for (let attr in v[0]) {
          if (v[0][attr] === null) {
            v[0][attr] = "";
          }
        }
        let str = JSON.stringify(v[0]);
        let data = JSON.parse(str);
        this.userForm.departmentId = data.id;
        this.userForm.departmentTitle = data.title;
      }
    },
    clearSelectDep() {
      this.userForm.departmentId = "";
      this.userForm.departmentTitle = "";
    },
    handleChangeDep(value, selectedData) {
      // 获取最后一个值
      if (value && value.length > 0) {
        this.searchForm.departmentId = value[value.length - 1];
      } else {
        this.searchForm.departmentId = "";
      }
    },
    handleChangeUserFormDep(value, selectedData) {
      // 获取最后一个值
      if (value && value.length > 0) {
        this.userForm.departmentId = value[value.length - 1];
      } else {
        this.userForm.departmentId = "";
      }
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUserList(false, false, false);
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUserList(false, false, false);
    },
    getUserList(needRecord, showResult, checkCondition) {
      if (!this.searchForm.realname && !this.searchForm.phone && !this.searchForm.idcard && checkCondition) {
          this.$Message.error('请输入搜索条件');
          return;
      }
      // 多条件搜索用户列表
      this.loading = true;
      this.$axios.api.userRecordList({
          page: this.searchForm.pageNumber,
          pageSize: this.searchForm.pageSize,
          realname: this.searchForm.realname,
          idcard: this.searchForm.idcard,
          phone: this.searchForm.phone,
          needRecord,
      }).then(res => {
        this.loading = false;
        if (res.message ===  'success') {
          this.data = res.data.list;
          this.total = res.data.total;
          if (showResult && res.data.list.length) {
            this.$Message.success(`搜索成功, 剩余积分: ${res.data.record}`);
          }
        }
        
      });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getUserList(false, false, false);
    },
    handleBatchDelete() {
      let rows = this.$refs.selection.getSelection()
      if (!rows || rows.length === 0){
        this.$Message.error('请先选择需要删除的数据')
        return
      }
      let ids = rows.map(row => {
        return row.id
      })
      this.handleDelete(ids)
    },
    handleDelete(id) {
     console.log('id ==== ', id)
      id = Array.isArray(id) ? id : [id]
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除"+id.length+"条数据",
        onOk: () => {
          this.operationLoading = true;
          this.$axios.api.deleteRecord({id:id}).then(res => {
            this.operationLoading = false;
            if (res.message ===  'success') {
              this.$Message.success("删除成功");
              this.getUserList(false,false,false);
            }
          });
        }
      });
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.selectDep = [];
      this.searchForm.departmentId = "";
    },
    getRoleList() {
      this.$axios.api.getAllRoleList().then(res => {
        if (res.message ===  'success') {
          this.roleList = res.data;
        }
      });
    },
    cancelUser() {
      this.userModalVisible = false;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "不支持的文件格式",
        desc:
          "所选文件‘ " +
          file.name +
          " ’格式不正确, 请选择 .xlsx格式文件"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小过大",
        desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
      });
    },
    handleSuccess(res, file) {
    if (res.message ===  'success') {
        file.url = res.data;
        this.$Message.success(`成功上传${res.data}条数据`);
    } else {
        this.$Message.error(res.message);
    }
    },
    handleError(error, file, fileList) {
      this.$Message.error(error.toString());
    },
    handleBeforeUpload() {
        let flag = false;
        this.$store.state.user.whiteApiList.forEach(item => {
            if (this.$store.state.app.uploadUrl.indexOf(item.url) && item.method === 'POST') {
                flag = true;
            }
        });
        if (!flag) {
            this.$Message.error('无此功能权限, 请联系管理员开通')
        }
        return flag;
    }
  },
};
</script>
<style lang="less" scoped>
.search {
    .operation {
        margin-bottom: 2vh;
    }
    .select-count {
        font-size: 13px;
        font-weight: 600;
        color: #40a9ff;
    }
    .select-clear {
        margin-left: 10px;
    }
    .page{
        margin-top: 2vh;
    }
    .drop-down{
        font-size: 13px;
        margin-left: 5px;
    }
}

.upload {
    margin-top: 10px;
}

.ivu-poptip {
    display: inline-block;
    width: 100%;
}

.ivu-poptip-rel {
    display: inline-block;
    position: relative;
    width: 100%;
}

.tree-bar {
    max-height: 500px;
    overflow: auto;
    margin-top: 5px;
}

.tree-bar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.tree-bar::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
}
</style>
