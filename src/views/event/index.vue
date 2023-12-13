<template>

    
  <!--  make a introduce frame -->
  <div class="introduce" v-if="currentSelect">
    <h1>{{ currentSelect.name }}</h1>
    <p>{{ currentSelect.desc }}</p>
  </div>
  <GoogleMap
    api-key="AIzaSyDEOMClw9T70e7oNGh73NPL6SH_WPhc27Y"
    style="width: 50%; height: 500px"
    :center="center"
    :zoom="13"
  >
    <MarkerCluster>
      <Marker v-for="(data, i) in locations" :options="{ position: data.pos }" :key="i"
      @click="getInfo(data)"
      >
        <!-- <InfoWindow :options="{ content: 'InfoWindow' }" v-if="infowindow"
      >
        <div>
          <h1>{{ data.name }}</h1>
          <p>{{ data.desc  }}</p>
        </div>
    </InfoWindow> -->
             
      </Marker>
    </MarkerCluster>
  </GoogleMap>
  </template>
  <script>
  import { defineComponent, ref } from 'vue'
  import { GoogleMap, Marker, MarkerCluster, InfoWindow } from 'vue3-google-map'
  
  export default defineComponent({
    /* eslint-disable */
    components: { GoogleMap, Marker, MarkerCluster, InfoWindow },
    setup() {  
      const center = { lat: 35.711150, lng: 139.780772 }
  
      const locations = [
        {id: 1, name:  "富岡八幡宮骨董市開催情報", desc:"開催時間	6時00分～15時00分開催日程	・2023年12月10日(日)※非会員の方には直近の開催日のみ表示しています。",  pos:{ lat: 35.729682, lng: 139.784156 } },
        {id: 2, name:  "大井競馬場　-Tokyo City Flea Market-開催情報  ", desc:"開催時間	9時00分～14時30分開催日程	・2023年12月10日(日)※非会員の方には直近の開催日のみ表示しています。", pos:{ lat: 35.717422, lng: 139.775858 } }, 
        // Add more locations as needed, it better in tokyo
  
      ]
      const infowindow = ref(true); // Will be opened when mounted
  
      return { center, locations, infowindow  }
    },
    data () {
      return {
        currentSelect: null
      }
    },
    methods: {
      getInfo(locationData) { 
        this.currentSelect = locationData
      }
    }
  })
  </script>