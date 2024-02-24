<template>
    <el-tab-pane label="Sub_Image">
      <el-row :gutter="20">
        <el-col :span="4">
          <a style="font-size:12px">Upload:</a>
          <el-upload drag class="avatar-uploader" :action="upload.subImageUrl" style="background-color: #13ce66"
            :on-success="uploadedSubImage" :on-progress="handleFileUploadProgress" :headers="upload.headers"
            :data="upload.SubImageData">
            <el-image style="height: 100px;" v-if="imageUrl" :src="imageUrl" />
            <el-icon v-else class="avatar-uploader-icon">
            </el-icon>
          </el-upload>
        </el-col>
        <el-col :span="20">
          <el-scrollbar>
            <div class="scrollbar-flex-content">
              <!-- upload -->
              <p v-for="(img, i) in sub_images" :key="img" class="scrollbar-demo-item"
                style="height: 100px; width:auto; max-width:20%;">
                <el-image :src="hostFront + img.file_path" fit="cover" style="width: 100px; height: 150px"
                  @click="selectSubImage(i)" />
              </p>
            </div>
          </el-scrollbar>
        </el-col>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="Full_Image">
      <el-row :gutter="20">
        <el-col :span="4">
          <a style="font-size:12px">Upload:</a>
          <el-upload drag class="avatar-uploader" :action="upload.url" :show-file-list="true"
            style="background-color: #13ce66" :on-success="handleFileSuccess" :on-progress="handleFileUploadProgress"
            :headers="upload.headers" :data="upload.FullImageData">
            <el-image style="height: 100px;" :fit="cover" v-if="imageUrl" :src="hostFront + imageUrl"
              class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-col>
        <el-col :span="20">
          <el-scrollbar>
            <div class="scrollbar-flex-content">
              <!-- upload -->
              <p v-for="(img, i) in full_images" :key="img" class="scrollbar-demo-item"
                style="height: 100px; width:auto; max-width:20%;">
                <el-image :src="hostFront + img.file_path" fit="contain" style="width: 150px; height: 100px"
                  @click="selectFullImage(i)" />
              </p>
            </div>
          </el-scrollbar>
        </el-col>
      </el-row>
    </el-tab-pane>
</template>

<script>
export default {
  name: 'RightTabs',
  props: {
    sub_images: {
      type: Array,
      default: () => [],
    },
    full_images: {
      type: Array,
      default: () => [],
    },
    hostFront: {
      type: String,
      default: () => {},
    },

    setting: {
      type: Object,
      default: () => {},
    },
    upload: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
    };
  },
  methods: { 
    selectSubImage(index) {
      this.$emit('selectSubImage', index)
    },
    selectFullImage(index) {
      this.$emit('selectFullImage', index)
    },
    uploadedSubImage(response, file, fileList) {
      this.$emit('uploadedSubImage', response, file, fileList)
    },
    uploadedFullImage(response, file, fileList) {
      this.$emit('uploadedFullImage', response, file, fileList) 
    },
    
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
      this.status = 'uploading'
    },
  },
};
</script>
<style scoped>
/* horizontal scroll bar */
.scrollbar-flex-content {
  display: flex;
}

.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}
</style>