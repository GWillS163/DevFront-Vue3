<template>   
<el-row>
  <el-col  >
    <el-text>
      <h1>拼图求解器 </h1>
      <h4>Puzzle Cracker / パズル　チットツール - Ver 0.8.3</h4>
    </el-text>
  </el-col>
</el-row>
 
<el-row>
  <el-col :span="2">
    進度
  </el-col>
<el-col :span="18"> 
  <el-progress 
  :percentage="progress"
  :stroke-width="15"
  status="success" 
  striped
  :indeterminate="progress > 0"
/>
</el-col>
<el-col :span="2">
  <el-button type="primary" @click="refresh">Refresh</el-button>
</el-col>
</el-row>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="24" :md="0">
      <el-tabs type="border-card">
        <LeftTabs :current-select="currentSelect" :status="status" @pwn="pwn" :hostFront="hostFront" :upload="upload"
          :settings="settings"  @changePwn="changePwn" new-upload @uploadedSubImage="uploadedSubImage"/>
        <el-tab-pane label="History">
          <History :history="history" :hostFront="hostFront" @selectResultImage="selectResultImage" />
        </el-tab-pane>
        <RightTabs :sub_images="sub_images" :full_images="full_images" :settings="settings" :hostFront="hostFront"
          :upload="upload" @selectSubImage="selectSubImage" @selectFullImage="selectFullImage"
          @uploadedFullImage="uploadedFullImage" @uploadedSubImage="uploadedSubImage" /> 

      </el-tabs>
    </el-col>
  </el-row>

  <el-row>
    <el-col :xs="0" :sm="0" :md="12">
      <el-tabs type="border-card">
        <LeftTabs :current-select="currentSelect" :status="status" @pwn="pwn" :hostFront="hostFront" :upload="upload"
          :settings="settings" @changePwn="changePwn" @uploadedSubImage="uploadedSubImage"/>
      </el-tabs>
    </el-col>
    <el-col :xs="0" :sm="0" :md="12">
      <el-tabs type="border-card">
        <RightTabs :sub_images="sub_images" :full_images="full_images" :settings="settings" :hostFront="hostFront"
          :upload="upload" @selectSubImage="selectSubImage" @selectFullImage="selectFullImage"
          @uploadedFullImage="uploadedFullImage" @uploadedSubImage="uploadedSubImage" /> 
      </el-tabs>
    </el-col>
  </el-row>

  <el-row>
    <el-col :xs="0" :sm="0" :md="10" style="height: 30rem;overflow-y: auto;">
      <History :history="history" :hostFront="hostFront" @selectResultImage="selectResultImage" />
    </el-col>
    <el-col :xs="24" :sm="24" :md="14">
      <!-- <el-image :src="resultImg" style="width: 100%;" :preview-src-list="[resultImg]" /> -->
      <img :src="resultImg" style="width: 100%;" @click="openWindowImg" />
      <!-- add a html raw image tage -->
      
      <div v-if="!resultImg" style="background-color: grey; width: 100%; height: 100px; display: flex; align-items: center; justify-content: center;">
        No Result Image
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { defineComponent, ref } from 'vue'
import RightTabs from './rightTabs.vue';
import LeftTabs from './leftTabs.vue';
import History from './history.vue';

import axios from 'axios'
import { getToken } from "@/utils/auth";
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const host = "http://192.168.40.249"
const hostBack = host + ":8080"
const hostFront = host + ":3000"

const getSubImageUrl = hostBack + "/puzzleCracker/getSubImage"
const getFullImageUrl = hostBack + "/puzzleCracker/getFullImage"


export default defineComponent({
  components: {
    RightTabs, LeftTabs, History
  },
  /* eslint-disable */
  data() {
    const settings = ref({
      autoSelectSubImage: true,
      autoSelectFullImage: true,
      autoPwn: true,
      areas: []
    })
    return {
      currentSelect: {
        subImage: 0,
        fullImage: 0,
      },
      progress: 0,
      status: 'unstart',
      resultImg: ref(""),
      sub_images: [],
      full_images: [],
      settings,
      hostFront: hostFront,
      history: [],
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: hostBack + '/puzzleCracker/upload',
        subImageUrl: hostBack + '/puzzleCracker/uploadSubImage',
        fullImageUrl: hostBack + '/puzzleCracker/uploadFullImage',
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
        if (this.settings.autoSelectSubImage) {
          this.selectSubImage(0)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    async get_Full_Images() {
      await axios.get(getFullImageUrl).then((res) => {
        this.full_images = res.data
        if (this.settings.autoSelectFullImage) {
          this.selectFullImage(0)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    async get_history() {
      await axios.get(hostBack + '/puzzleCracker/getHistory').then((res) => {
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
    autoPwn() {
      // this.refresh();
      if (this.settings.autoPwn) {
        this.pwn()
      }
    },
    pwn() {
      debugger
      if (this.currentSelect.subImage == 0 || this.currentSelect.fullImage == 0) {
        alert("Please select sub image and full image")
        return
      }
      this.status = 'pwning'
      this.progress = 60

      axios.post(hostBack + '/puzzleCracker/pwn', this.upload.PwnData).then((res) => {
        this.resultImg = hostFront + res.data.fileUrl
        this.status = 'done'

        if (res.code !== 200 || res.code !== "200") {
          ElMessage.error('解析失败: ' + res.message);
          return;
        }
      }).catch((err) => {
        console.log(err)
        this.status = 'failed'
      })
      this.refresh();
      this.progress = 100
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
    selectResultImage(ResultImg) {
      this.resultImg = ResultImg
    },
    uploadedSubImage(response) {
      console.log(response)
      this.init_Sub_Images()
      // click last image
      this.selectSubImage(0)
    },
    uploadedFullImage(response) {
      console.log(response)
      this.get_Full_Images()
      // click last image
      this.selectFullImage(0)
    },
    handleFileSuccess(response) {
      console.log(response)
      // if (response.code !== "200") {
      //   // this.$message.error('上传失败');
      //   return;
      // } 

      // this.upload.isUploading = false;
      // this.status = 'uploaded'

      this.autoPwn(); 
      this.$refs.upload.clearFiles();

    },
    changePwn() {
      if (this.settings.autoPwn) {
        this.settings.autoSelectSubImage = true
        this.settings.autoSelectFullImage = true
      }
    },
    openWindowImg() {
      window.open(this.resultImg)
    }

  },

})
</script>

<style scoped>
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