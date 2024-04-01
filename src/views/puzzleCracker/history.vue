<template>
    <div  class="history_table">
    <table>
        <tr>
            <!-- <th>Sub Image</th>
              <th>Full Image</th> -->
            <th>Output Image</th>
            <th>Time</th>
            <th>Accuracy</th>
        </tr>
        <tr v-for="item in history" :key="item.id">
            <!-- <td><el-image :src="hostFront + item.sub_image" style="width: 100px; height: 100px"  fit="cover"/></td>
              <td><el-image :src="hostFront + item.full_image" style="width: 80px; height: 100px"  fit="contain"/></td> -->
              <td><el-image :src="hostFront + item.output_image" style="width: 320px;" fit="contain"
                    @click="selectResultImage(hostFront + item.output_image)" /></td>
        <td> {{ item.created_time }}</td>
            <td style="width: 1%;">
                <el-progress type="circle" :percentage="item.accuracy * 100" />
            </td>
       </tr>
    </table>
    </div>
</template>
<script>
export default {
    name: 'History',
    props: {
        history: {
            type: Array,
            default: () => [],
        },
        hostFront: {
            type: String,
            default: () => {},
        },
    },
    data() {
        return {
        };
    },
    methods: {
        selectResultImage(url) {
            this.$emit('selectResultImage', url)
        },
    },
}
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

.history_table {
  width: 100%;
  border-collapse: collapse;
  height: 20rem;
  display: flex;
    flex-direction: column;
    overflow-y: auto;
}
</style>