<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="createdTime" prop="createdTime">
        <el-date-picker clearable
          v-model="queryParams.createdTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择${comment}">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="accuracy" prop="accuracy">
        <el-input
          v-model="queryParams.accuracy"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="subImageId" prop="subImageId">
        <el-input
          v-model="queryParams.subImageId"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="fullImageId" prop="fullImageId">
        <el-input
          v-model="queryParams.fullImageId"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="note" prop="note">
        <el-input
          v-model="queryParams.note"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:history:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:history:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:history:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:history:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="historyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="id" align="center" prop="id" /> -->
      <el-table-column label="subImage" align="center" prop="subImage" width="100">
        <template #default="scope">
          <image-preview :src="getFullImageUrl(scope.row.subImage)" :width="150" :height="150" :fit="contain"/>
        </template>
      </el-table-column>
      <el-table-column label="fullImage" align="center" prop="subImage" width="100">
        <template #default="scope">
          <image-preview :src="getFullImageUrl(scope.row.fullImage)" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="accuracy" align="center" prop="accuracy">
        
        <template #default="scope">
        <el-progress type="circle" :percentage="scope.row.accuracy * 100"  />
        </template>
      </el-table-column>
      <el-table-column label="outputImage" align="center" prop="subImage" width="100">
        <template #default="scope"> 
          <image-preview :src="getFullImageUrl(scope.row.outputImage)" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="createdTime" align="center" prop="subImage" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="note" align="center" prop="subImage" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:history:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:history:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改图片列表-Picture List对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="historyRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="subImage" prop="subImage">
          <image-upload v-model="form.subImage"/>
        </el-form-item>
        <el-form-item label="fullImage" prop="fullImage">
          <image-upload v-model="form.fullImage"/>
        </el-form-item>
        <el-form-item label="createdTime" prop="createdTime">
          <el-date-picker clearable
            v-model="form.createdTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择${comment}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="accuracy" prop="accuracy">
          <el-input v-model="form.accuracy" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="subImageId" prop="subImageId">
          <el-input v-model="form.subImageId" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="fullImageId" prop="fullImageId">
          <el-input v-model="form.fullImageId" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="outputImage" prop="outputImage">
          <image-upload v-model="form.outputImage"/>
        </el-form-item>
        <el-form-item label="note" prop="note">
          <el-input v-model="form.note" placeholder="请输入${comment}" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
  
</template>

<script setup name="History">
import { listHistory, getHistory, delHistory, addHistory, updateHistory } from "@/api/system/history";

const { proxy } = getCurrentInstance();
const hostUrl = inject('hostUrl');

const historyList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    subImage: null,
    fullImage: null,
    createdTime: null,
    accuracy: null,
    subImageId: null,
    fullImageId: null,
    outputImage: null,
    note: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询图片列表-Picture List列表 */
function getList() {
  loading.value = true;
  listHistory(queryParams.value).then(response => {
    historyList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    subImage: null,
    fullImage: null,
    createdTime: null,
    accuracy: null,
    subImageId: null,
    fullImageId: null,
    outputImage: null,
    note: null
  };
  proxy.resetForm("historyRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加图片列表-Picture List";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getHistory(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改图片列表-Picture List";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["historyRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateHistory(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addHistory(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除图片列表-Picture List编号为"' + _ids + '"的数据项？').then(function() {
    return delHistory(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/history/export', {
    ...queryParams.value
  }, `history_${new Date().getTime()}.xlsx`)
}

function getFullImageUrl(url) {
  return hostUrl + url;
}

getList();
</script>
