<template>
    <div style="background:#eee;padding: 20px;">
        <Card :bordered="false" style="min-height: 200px">
            <p slot="title">欢迎使用违约查询系统</p>
            <p>{{ `账户当前剩余积分: ${this.record}` }}</p>
            <p>{{ `当前系统违约记录总条数: ${this.total} 条` }}</p>
        </Card>
    </div>
</template>

<script>
import circleLoading from "~/components/circle-loading.vue";
export default {
  layout: 'permission',
  name: "home",
  data() {
      return {
          total: 0
      }
  },
  components: {
    circleLoading,
  },
  mounted() {
      this.$axios.api.recordTotal().then(res => {
          if (res.message === 'success') {
              this.total = res.data.total;
              this.record = res.data.record;
          }
      })
  }
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
