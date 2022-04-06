<template>
  <div class="usermanagement">

  </div>
</template>

<script>
import {
  usertree,
  serverModule,
  userList,
  disabledUser,
  delUserInfo
} from '@/api/user'
import ElSelectTree from 'el-select-tree'
import EditUser from './editUser.vue'

export default {

}
</script>

<style lang="scss">
.usermanagement {
  .filter-item-box {
    margin-left: 10px;
  }
}
.admin-right {
  .table-data {
    margin-top: 10px;
    border-top: 1px solid #ecf2f7;
  }
  .pdl10 {
    padding-left: 10px;
  }
}
</style>
