<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-tabs type="border-card">
        <el-tab-pane label="Main">
          <el-row :gutter="20">
            <el-col :span="7">
              <div v-if="!currentSelect.subImage"
                style="height: 100px; width: 100px; background-color: lightgrey; display: flex; align-items: center; justify-content: center;">
              </div>
              <el-image v-else="currentSelect.subImage" fit="cover" style="width: 100px; height: 100px"
                :src="imgPrefix + currentSelect.subImage.file_path" class="avatar" />
              <b>Current Sub Image</b>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="pwn('output')" style="width: 100%; margin-top: 50%;">
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
              <div v-if="!currentSelect.fullImage"
                style="height: 100px; width: 100px; background-color: lightgrey; display: flex; align-items: center; justify-content: center;">
              </div>
              <el-image v-if="currentSelect.fullImage" style="max-width: 100%; "
                :src="imgPrefix + currentSelect.fullImage.file_path" class="avatar" />
              <b>Current Full Image</b>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Settings">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form :model="upload.PwnData" label-width="90px">
                <el-form-item label="Accuracy: ">
                  <el-slider v-model="upload.PwnData.accuracy" :min="0" :max="1" :step="0.01" show-input />
                </el-form-item>
                <el-form-item label="Auto Pwn after upload: " label-width="100px">
                  <el-form-item label="Sub_Image" label-width="90px">
                    <el-switch v-model="setting.autoTriggerSubImage" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>
                  <el-form-item label="Full_Image" label-width="90px">
                    <el-switch v-model="setting.autoTriggerFullImage" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>
                </el-form-item>
              </el-form>
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
                    <el-image :src="imgPrefix + img.file_path" fit="cover" style="width: 100px; height: 150px"
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
                <el-image style="height: 100px;" :fit="cover" v-if="imageUrl" :src="imgPrefix + imageUrl"
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
                    <el-image :src="imgPrefix + img.file_path" fit="contain" style="width: 150px; height: 100px"
                      @click="selectFullImage(i)" />
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
    <el-col :span="10" style="height: 30rem;overflow-y: auto;">
      <table >
        <tr>
          <th>Sub Image</th>
          <th>Full Image</th>
          <th>Acc</th>
          <th>Output Image</th>
        </tr>
        <tr v-for="item in history" :key="item.id">
          <td><el-image :src="imgPrefix + item.sub_image" style="width: 100px; height: 100px"  fit="cover"/></td>
          <td><el-image :src="imgPrefix + item.full_image" style="width: 80px; height: 100px"  fit="contain"/></td>
          <td style="width: 10px;">{{ item.accuracy }}</td>
          <td ><el-image :src="imgPrefix + item.output_image" style="width: 180px; height: 80px"  fit="contain"
            @click="selectResultImage(imgPrefix + item.output_image)" 
            /></td>
        </tr>
      </table> 
    </el-col>
    <el-col :span="14">
      <el-image :src="resultImg" style="width: 100%;" 
            :preview-src-list="[resultImg]"
             />
    </el-col>
  </el-row>
  <!-- <form :action="upload.url" method="post" enctype="multipart/form-data">
    <label for="file-upload">Choose file to upload:</label>
    <input type="file" id="file-upload" name="file">
    <input type="submit" value="Upload">
  </form> --> 

 
</template>
<script>
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import { getToken } from "@/utils/auth";
const failedText = "No result found"
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import Cropper from 'cropperjs';
import { fabric } from 'fabric';



const imageUrl = ref('')
const host = "http://192.168.40.249:8080"

const getSubImageUrl = host + "/puzzleCracker/getSubImage"
const getFullImageUrl = host + "/puzzleCracker/getFullImage"


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
    const setting = ref({
      autoTriggerSubImage: false,
      autoTriggerFullImage: false
    })
    const imgPrefix = "http://localhost:3000/"
    return {
      currentSelect: {
        subImage: 0,
        fullImage: 0,
      },
      imgPrefix,
      url,
      srcList,
      status: 'unstart',
      resultImg: ref(""),
      sub_images: [],
      full_images: [],
      setting,
      history: [],
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: host + '/puzzleCracker/upload',
        subImageUrl: host + '/puzzleCracker/uploadSubImage',
        fullImageUrl: host + '/puzzleCracker/uploadFullImage',
        // 上传的文件列表
        fileList: [],
        PwnData: {
          SubImage: 0,
          FullImage: 0,
          SubImageId: 0,
          FullImageId: 0,
          Accuracy: 0.78
        },
        SubImageData: {
          type: "Sub_Image"
        },
        FullImageData: {
          type: "Full_Image"
        }
      },
      cropper: null
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    async init_Sub_Images() {
      await axios.get(getSubImageUrl).then((res) => {
        this.sub_images = res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    async get_Full_Images() {
      await axios.get(getFullImageUrl).then((res) => {
        this.full_images = res.data
      }).catch((err) => {
        console.log(err) 
      })
    },
    async get_history() {
      await axios.get(host + '/puzzleCracker/getHistory').then((res) => {
        this.history = res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    async init_Full_Images() {
      await this.get_Full_Images();
      this.selectFullImage(this.full_images.length - 1)
    },
    async refresh() {
      this.init_Sub_Images()
      this.init_Full_Images()
      this.get_history()
    },
    selectResultImage(ResultImg) {
      this.resultImg = ResultImg 
    },
    selectFullImage(index) {
      this.upload.PwnData.FullImageId = this.full_images[index].id
      this.upload.PwnData.FullImage = this.full_images[index].file_path
      this.currentSelect.fullImage = this.full_images[index]
    },
    selectSubImage(index) {
      this.upload.PwnData.SubImageId = this.sub_images[index].id
      this.upload.PwnData.SubImage = this.sub_images[index].file_path
      this.currentSelect.subImage = this.sub_images[index]
    },

    pwn() {
      if (this.currentSelect.subImage == 0 || this.currentSelect.fullImage == 0) {
        alert("Please select sub image and full image")
        return
      }
      this.status = 'pwning'

      axios.post(host + '/puzzleCracker/pwn', this.upload.PwnData).then((res) => { 
        this.resultImg = this.imgPrefix + res.data.fileUrl
        this.status = 'done'
      }).catch((err) => {
        console.log(err) 
        this.status = 'failed'
      })
      this.refresh();
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
      if (response !== 'success') {
        alert('上传失败,' + response);
        return;
      }

      this.upload.isUploading = false;
      this.status = 'uploaded'


      //  "outputs/" +
      // this.resultImg = imgPrefix + response.fileUrl;
      // this.resultImg = "http://localhost:3000/outputs/building_multi_result.jpg"
      // this.upload.isUploading = false;
      // this.resultImg = response.fileUrl; 
      // this.showResult("output")

      // // refresh page
      // this.$router.go(0)

    },
    uploadedSubImage(response) {
      this.handleFileSuccess(response)
      this.init_Sub_Images()
      // click last image
      this.selectSubImage(this.sub_images.length - 1)
    },
    uploadedFullImage(response) {
      this.handleFileSuccess(response)
      this.get_Full_Images()
      // click last image
      this.selectFullImage(this.full_images.length - 1)
    },
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