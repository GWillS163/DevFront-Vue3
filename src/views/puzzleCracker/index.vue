<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-tabs type="border-card">
        <el-tab-pane label="Main">
          <el-row :gutter="20">
            <!-- <el-col :span="6">
              <el-upload drag class="avatar-uploader" :action="upload.url" :show-file-list="true"
                :on-success="handleFileSuccess" :on-progress="handleFileUploadProgress" :headers="upload.headers"
                :data="upload.data" :before-upload="beforeAvatarUpload"> 
                <el-icon   class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
              <b>Upload Sub Image</b>
            </el-col> -->
            <el-col :span="7">
              <img style="max-width: 100%;" :src="currentSelect.subImage" class="avatar" />
              <b>Current Sub Image</b>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="showResult('output')" style="width: 100%; margin-top: 50%;">
                <el-icon>
                  <Search />
                </el-icon>
                Pwn
                <el-icon>
                  <Right />
                </el-icon> 
              </el-button>
            </el-col>
            <el-col :span="7">
              <img style="max-width: 100%;" :src="currentSelect.fullImage" class="avatar" />
              <b>Current Full Image</b>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="12">
      <el-tabs type="border-card">
        <el-tab-pane label="Sub_Image">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-upload drag class="avatar-uploader" :action="upload.url" :show-file-list="true"
                :on-success="handleFileSuccess" :on-progress="handleFileUploadProgress" :headers="upload.headers"
                :data="upload.data" :before-upload="beforeAvatarUpload">
                <img style="height: 100px;" v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </el-col>
            <el-col :span="20">
              <el-scrollbar>
                <div class="scrollbar-flex-content">
                  <!-- upload -->
                  <p v-for="(img, i) in sub_images" :key="img" class="scrollbar-demo-item"
                    style="height: 100px; width:auto; max-width:20%;">
                    <el-image :src="img" fit="scale-down" @click="selectSubImage(i)" />
                  </p>
                </div>
              </el-scrollbar>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="Full_Image">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-upload drag class="avatar-uploader" :action="upload.url" :show-file-list="true"
                :on-success="handleFileSuccess" :on-progress="handleFileUploadProgress" :headers="upload.headers"
                :data="upload.data" :before-upload="beforeAvatarUpload">
                <img style="height: 100px;" v-if="imageUrl" :src="imageUrl" class="avatar" />
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
                    <el-image :src="img" fit="scale-down" @click="selectFullImage(i)" />
                  </p>
                </div>
              </el-scrollbar>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>

  <el-row>
    <el-col>
      <h1>Parsed Result: {{ status }}</h1>
    </el-col>
    <el-col>

    </el-col>
  </el-row>
  <!-- <form :action="upload.url" method="post" enctype="multipart/form-data">
    <label for="file-upload">Choose file to upload:</label>
    <input type="file" id="file-upload" name="file">
    <input type="submit" value="Upload">
  </form> -->
  <el-row>
    <el-container>
      <el-image style="max-width: 1000px;" v-if="resultImg != failedText" :src="resultImg" :zoom-rate="1.2"
        :preview-src-list="[resultImg]" :max-scale="7" :min-scale="0.2" :initial-index="4" fit="cover" />
      <el-text v-else class="mx-1" size="large">No result found</el-text>
    </el-container>
  </el-row>


  <el-dialog :visible.sync="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
</template>
<script>
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import { getToken } from "@/utils/auth";
const failedText = "No result found"
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'


const imageUrl = ref('')


const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
const imgPrefix = "http://localhost:3000/"

const output = "http://localhost:3000/outputs/default.jpg"

export default defineComponent({
  /* eslint-disable */
  setup() {
  },
  data() {
    const url =
      'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
    const srcList = [
      'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
      'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
      'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
      'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
      'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
      'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
      'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    ]

    return {
      currentSelect: {
        subImage: 0,
        fullImage: 0,
      },
      url,
      srcList,
      status: 'unstart',
      resultImg: ref(output),
      resultList: ref({
        "0": 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
        "1": 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
        "2": 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        "output": output,
      }),
      sub_images: [
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
      ],
      full_images: [
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg'
      ],
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: 'http://192.168.40.249:8080/puzzle-cracker/upload',
        // 上传的文件列表
        fileList: [],
        data: {
          targetMain: "D:\\Project\\puzzleCracker\\puzzleCases\\fully\\full_combine.jpg"
        }
      },
    }
  },
  mounted() {
    // this.resultImg = "http://localhost:3000/outputs/building_multi_result.jpg"
  },
  methods: {
    showResult(index) {
      console.log(index)
      if (!index in Object.keys(this.resultList)) {
        this.resultImg = failedText
      }
      this.resultImg = this.resultList[index]
    },
    selectFullImage(index) {
      this.upload.data.targetMain = this.full_images[index]
      this.currentSelect.fullImage = this.full_images[index]
    },
    selectSubImage(index) {
      this.upload.data.targetSub = this.sub_images[index]
      this.currentSelect.subImage = this.sub_images[index]
    },
    handleAdd() {
      // ...
      this.upload.fileList = [];
    },


    handleUpdate(row) {
      // ...
      this.upload.fileList = [{ name: this.form.fileName, url: this.form.filePath }];
    },
    // 文件提交处理
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
      this.status = 'uploading'
    },
    // 文件上传成功处理
    handleFileSuccess(response) {
      console.log(response)
      // if (response.code !== "200") {
      //   // this.$message.error('上传失败');
      //   return;
      // }
      if (response.message !== 'success') {
        alert('上传失败,' + response.message);
        return;
      }

      //  "outputs/" +
      this.resultImg = imgPrefix + response.fileUrl;
      this.resultImg = "http://localhost:3000/outputs/building_multi_result.jpg"
      this.upload.isUploading = false;
      // this.resultImg = response.fileUrl; 
      // this.showResult("output")

      // // refresh page
      // this.$router.go(0)

    }
    // ...其他方法
  },

})
</script>

<style scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

demo-image__error .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 49%;
  box-sizing: border-box;
  vertical-align: top;
}

.demo-image__error .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

.demo-image__error .el-image {
  padding: 0 5px;
  max-width: 300px;
  max-height: 200px;
  width: 100%;
  height: 200px;
}

.demo-image__error .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 100px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 1px;
  text-align: center;
}

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