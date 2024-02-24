<template>
    <el-tab-pane label="Main">
        <el-row :gutter="20">
            <el-col :span="4" v-if="newUpload">
                <a> New:</a>
                <el-upload class="avatar-uploader" :action="upload.subImageUrl" :on-preview="handlePreview"
                    :on-remove="handleRemove" 
                    ref="upload"
                    :on-success="uploadedSubImage" :limit="99"
                    :headers="upload.headers" :data="upload.SubImageData">
                    <el-button size="small" type="primary">Upload</el-button>
                </el-upload>
                <div slot="tip" class="el-upload__tip"> Jpg/png Only</div>
            </el-col>
            <el-col :span="7"> 
                <el-image fit="contain" style="height: 150px "
                    :src="hostFront + currentSelect.subImage.file_path" class="avatar" />
                <p>Current Sub Image</p>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" @click="pwn('output')" style="width: 100%; margin-top: 50%;">
                    <el-icon>
                        <Search v-if="status == 'unstart' || status == 'failed'" />
                        <Loading v-else-if="status == 'pwning'" />
                    </el-icon>
                    Pwn
                    <el-icon>
                        <Right />
                    </el-icon>
                </el-button>
            </el-col>
            <el-col :span="7"> 
                <el-image  :fit="cover" style="height: 150px "
                    :src="hostFront + currentSelect.fullImage.file_path" class="avatar" />
                <p>Current Full Image</p>
            </el-col>
        </el-row>
    </el-tab-pane>
    <el-tab-pane label="Settings">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-form :model="upload.PwnData" label-width="90px">
                    <el-form-item label="Accuracy: ">
                        <el-slider v-model="upload.PwnData.Accuracy" :min="0" :max="1" :step="0.01" show-input />
                    </el-form-item>
                    <hr />
                    <h4>After upload</h4>
                    <el-form-item label="Auto Pwn:" label-width="90px">
                        <el-switch v-model="settings.autoPwn" active-color="#13ce66" @click="changePwn"
                            inactive-color="#ff4949" />
                    </el-form-item>
                    <el-form-item label="Select New:" label-width="90px">
                        <el-form-item label="Sub_Image" label-width="90px">
                            <el-switch v-model="settings.autoSelectSubImage" active-color="#13ce66"
                                inactive-color="#ff4949" />
                        </el-form-item>
                        <el-form-item label="Full_Image" label-width="90px">
                            <el-switch v-model="settings.autoSelectFullImage" active-color="#13ce66"
                                inactive-color="#ff4949" />
                        </el-form-item>
                    </el-form-item>
                    <hr />
                </el-form>
            </el-col>
        </el-row>
    </el-tab-pane>
</template>

<script>

export default {
    name: 'LeftTabs',
    props: {
        currentSelect: {
            type: Object,
            default: () => {
                return {
                    subImage: null,
                    fullImage: null
                }
            }
        },
        settings: {
            type: Object,
            default: () => {
                return {
                    autoSelectSubImage: false,
                    autoSelectFullImage: false,
                    autoPwn: false,
                    areas: []
                }
            }
        },
        
        hostFront: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            default: ''
        },
        newUpload: {
            type: Boolean,
            default: false
        },
        upload: {
            type: Object,
            default: () => {
                return {
                }
            }
        }
    },
    data() {
        return {
            setting: {
                autoTriggerSubImage: false,
                autoTriggerFullImage: false
            }
        }
    },
    methods: {
        pwn(type) {
            this.$emit('pwn', type)
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        uploadedSubImage(response, file, fileList) {
            this.$emit('uploadedSubImage', response, file, fileList)
        },
        changePwn() {
            this.$emit('changePwn')
        }
    }
}

</script>