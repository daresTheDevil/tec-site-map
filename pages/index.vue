<template>
  <div class="fixed flex flex-col w-full min-h-screen">
    <nav
      id="header"
      class="top-0 z-30 w-full py-3 text-gray-800 bg-purple-900 shadow-md"
    >
      <div class="flex flex-wrap items-center justify-between w-full px-8 mt-0">
        <div class="flex items-center">
          <!-- <img src="tec-logo.svg" class="w-20 mr-4" /> -->
          <span class="text-white text-4xl font-black tracking-tighter"><span class="font-thin">SITE</span>MAP</span>
        </div>

        <div class="flex items-center" v-if="loading">
          <div
            class="flex w-64 h-10 overflow-hidden bg-purple-800 rounded-full"
          >
            <div
              class="flex h-full bg-teal-300"
              :style="`width: ${codedProgress}%`"
            />
            <div
              class="flex h-full bg-yellow-300"
              :style="`width: ${uncodedProgress}%`"
            />
          </div>
          <div class="ml-4">
            <h1 class="text-lg text-gray-100">{{ progress }}%</h1>
          </div>
        </div>

        <div class="flex items-center">
          <!-- <div
            class="px-4 py-2 mr-4 text-gray-800 bg-teal-300 rounded-full"
            v-if="dataMarkers.length > 0"
          >
            Coded: {{ dataMarkers.length }}
          </div>
          <div
            class="px-4 py-2 mr-4 text-gray-800 bg-yellow-300 rounded-full"
            v-if="uncodedMarkers.length > 0"
          >
            Uncoded: {{ uncodedMarkers.length }}
          </div> -->
          <button
            class="inline-flex items-center px-4 py-2 font-bold text-gray-100 border-2 border-purple-100 rounded-lg hover:bg-purple-200 hover:text-purple-800 hover:border-purple-800"
            @click.stop="addFiles"
          >
            <svg class="w-6 h-6 mr-2 fill-current" viewBox="0 0 24 24">
              <path
                d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z"
              />
            </svg>

            <span>Upload</span>
          </button>
        </div>
      </div>

      <!-- <hr class="py-0 my-0 border-b border-gray-100 opacity-25" /> -->
    </nav>
    <div class="flex flex-col flex-grow bg-green-200">
      <no-ssr>
        <l-map
          ref="tecMap"
          :zoom="6.5"
          :center.sync="center"
          class="flex flex-grow h-full"
          style="height: 100%; width: 100%; z-index: 1;"
          @click="addMarker"
        >
          <l-tile-layer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          ></l-tile-layer>
          <l-geo-json
            v-if="showGeojson"
            ref="geojson"
            :geojson="features"
            :options-style="styleFunction"
          />
          <l-polyline :lat-longs="polyline.latlngs" color="red" />
          <template v-if="showFiber">
            <l-polyline
              v-for="(item, index) in fiberRuns"
              :key="index"
              :lat-lngs="item.latlngs"
              color="green"
            >
            </l-polyline>
          </template>
          <l-marker-cluster>
            <l-marker
              v-for="(marker, i) in dataMarkers"
              :key="i"
              :lat-lng="[
                marker.geometry.location.lat,
                marker.geometry.location.lng
              ]"
            >
              <l-popup class="min-w-32">
                <h1 class="text-sm text-gray-600">Address:</h1>
                <h1
                  class="text-base"
                  :class="
                    addressNumber(marker) === 'Check Address'
                      ? 'font-bold text-red-600'
                      : 'font-medium text-gray-800'
                  "
                >
                  {{ addressNumber(marker) }} {{ addressStreet(marker) }}<br />
                  {{ addressCity(marker) }}, {{ addressState(marker) }}
                  {{ addressZip(marker) }}<br />
                  {{ addressCounty(marker) }}
                </h1>
              </l-popup>
            </l-marker>
          </l-marker-cluster>
          <!-- <div class="top-0 left-0 flex m-4 z-9999">
            <div
              v-if="uncodedMarkers.length > 0"
              class="flex items-center h-12 px-4 py-2 bg-gray-100 border-2 rounded-lg shadow-lg"
            >
              <h1 class="mr-2 text-lg font-bold text-gray-700">
                Unrecognized Addresses:
              </h1>
              <div
                class="flex items-center justify-center px-2 py-1 text-lg text-red-100 bg-red-600 rounded-full"
              >
                {{ uncodedMarkers.length }}
              </div>
            </div>
          </div> -->

          <div class="absolute top-0 right-0 flex flex-col m-4 z-9999">
            <button
              class="flex items-center justify-center w-12 h-12 bg-purple-900 border-b-2 border-purple-500 rounded-t-lg shadow-lg active:bg-purple-800 active:shadow-none"
              @click.stop="resetMap"
            >
              <svg
                class="w-8 h-8 text-gray-100 fill-current"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
                />
              </svg>
            </button>
            <button
              class="flex items-center justify-center w-12 h-12 bg-purple-900 shadow-lg active:bg-purple-800 active:shadow-none"
            >
              <svg
                class="w-8 h-8 text-gray-100 fill-current"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9,11.5A2.5,2.5 0 0,0 11.5,9A2.5,2.5 0 0,0 9,6.5A2.5,2.5 0 0,0 6.5,9A2.5,2.5 0 0,0 9,11.5M9,2C12.86,2 16,5.13 16,9C16,14.25 9,22 9,22C9,22 2,14.25 2,9A7,7 0 0,1 9,2M15,17H18V14H20V17H23V19H20V22H18V19H15V17Z"
                />
              </svg>
            </button>
            <button
              class="flex items-center justify-center w-12 h-12 shadow-lg active:shadow-none"
              :class="
                showGeojson
                  ? 'bg-green-600 active:bg-green-500'
                  : 'bg-red-600 active:bg-red-500'
              "
              @click.stop="showGeojson = !showGeojson"
            >
              <svg
                class="w-8 h-8 text-gray-100 fill-current"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z"
                />
              </svg>
            </button>
            <button
              class="flex items-center justify-center w-12 h-12 rounded-b-lg shadow-lg active:shadow-none"
              :class="
                editMap
                  ? 'bg-green-600 active:bg-green-500'
                  : 'bg-red-600 active:bg-red-500'
              "
              @click.stop="editMap = !editMap"
            >
              <svg
                class="w-8 h-8 text-gray-100 fill-current"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16,2V8H17.08L14.95,13H14.26L12,9.97V5H6V11H6.91L4.88,16H2V22H8V16H7.04L9.07,11H10.27L12,13.32V19H18V13H17.12L19.25,8H22V2M18,4H20V6H18M8,7H10V9H8M14,15H16V17H14M4,18H6V20H4"
                />
              </svg>
            </button>
          </div>
        </l-map>
      </no-ssr>
    </div>
    <input
      id="fileInput"
      ref="files"
      type="file"
      class="hidden"
      @change="upload"
    />
  </div>
</template>

<script>
import axios from 'axios'
// import Papa from 'papaparse'
import XLSX from 'xlsx'
import rateLimit from 'axios-rate-limit'
import 'leaflet/dist/leaflet.css'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import features from '@/assets/data/geojson-ms-counties.json'

export default {
  layout: 'map',
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css'
        },
        {
          rel: 'stylesheet',
          href:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css'
        }
      ]
    }
  },
  components: { 'l-marker-cluster': Vue2LeafletMarkerCluster },
  data() {
    return {
      dataMarkers: [],
      uncodedMarkers: [],
      markers: [
        {
          Address: {
            City: 'Bay Springs',
            Country: 'USA',
            County: 'Smith',
            HouseNumber: '481',
            Label: '481 SCR 99, Bay Springs, MS 39422, United States',
            PostalCode: '39422',
            State: 'MS',
            Street: 'SCR 99'
          },
          NavigationPosition: [
            {
              Latitude: 31.9998687,
              Longitude: -89.3810881
            }
          ]
        },
        {
          Address: {
            City: 'Pulaski',
            Country: 'USA',
            County: 'Smith',
            HouseNumber: '3225',
            Label: '3225 SCR 559, Pulaski, MS 39152, United States',
            PostalCode: '39152',
            State: 'MS',
            Street: 'SCR 559'
          },
          NavigationPosition: [
            {
              Latitude: 32.180877,
              Longitude: -89.5617221
            }
          ]
        }
      ],
      showGeojson: true,
      showRequests: true,
      showFiber: true,
      editMap: false,
      doc: null,
      fillColor: '#e4ce7f',
      zoom: 6.5,
      features,
      originalCenter: [32.3547, -89.8],
      polyline: {
        latlngs: []
      },
      fiberRuns: [
        {
          name: 'Run 1',
          latlngs: [
            { lat: 32.04445980418589, lng: -89.60689544677736 },
            { lat: 32.046787878141664, lng: -89.59728240966797 },
            { lat: 32.046787878141664, lng: -89.56226348876955 },
            { lat: 32.037475227046826, lng: -89.53720092773439 },
            { lat: 32.038057295494845, lng: -89.5269012451172 },
            { lat: 32.03310959573873, lng: -89.51728820800783 },
            { lat: 32.03252749583841, lng: -89.50973510742188 },
            { lat: 32.03223644450074, lng: -89.50218200683595 },
            { lat: 32.03310959573873, lng: -89.49668884277345 },
            { lat: 32.02146689475617, lng: -89.47128295898438 },
            { lat: 32.01506277844937, lng: -89.4668197631836 },
            { lat: 32.01273389791075, lng: -89.43969726562501 },
            { lat: 32.01127831752081, lng: -89.43111419677736 },
            { lat: 32.01127831752081, lng: -89.38613891601562 },
            { lat: 32.005455764794334, lng: -89.36828613281251 },
            { lat: 31.986821110930183, lng: -89.35214996337892 },
            { lat: 31.982744275685217, lng: -89.33979034423828 },
            { lat: 31.977502364190727, lng: -89.3342971801758 },
            { lat: 31.974007590177635, lng: -89.31953430175781 },
            { lat: 31.97575499381851, lng: -89.30545806884767 },
            { lat: 31.978376036900755, lng: -89.29996490478516 },
            { lat: 31.977793589351563, lng: -89.28760528564455 }
          ]
        },
        {
          name: 'Run 2',
          latlngs: [
            { lat: 32.3643032772334, lng: -89.47849273681642 },
            { lat: 32.281327670564266, lng: -89.49050903320312 },
            { lat: 32.270587511273995, lng: -89.49600219726564 },
            { lat: 32.26245897800583, lng: -89.49497222900392 },
            { lat: 32.229356720329406, lng: -89.5114517211914 },
            { lat: 32.21541531881462, lng: -89.51179504394531 },
            { lat: 32.20699135272648, lng: -89.5045852661133 },
            { lat: 32.189850530648705, lng: -89.50836181640626 },
            { lat: 32.172415875063656, lng: -89.50870513916017 },
            { lat: 32.18491105051798, lng: -89.50870513916017 },
            { lat: 32.17212526918799, lng: -89.50836181640626 },
            { lat: 32.15962833945772, lng: -89.4990921020508 },
            { lat: 32.14422278872305, lng: -89.50080871582033 },
            { lat: 32.126779400891536, lng: -89.51728820800783 },
            { lat: 32.119510338167196, lng: -89.51797485351564 },
            { lat: 32.10467965495091, lng: -89.5114517211914 },
            { lat: 32.07733835890496, lng: -89.52930450439455 },
            { lat: 32.06191891536363, lng: -89.52449798583986 },
            { lat: 32.042713709860045, lng: -89.52209472656251 },
            { lat: 32.01710050037138, lng: -89.5159149169922 },
            { lat: 32.0077848302677, lng: -89.5210647583008 }
          ]
        }
      ],
      center: [32.3547, -89.8],
      staticAnchor: [60, 30],
      dragging: false,
      clipped: false,
      loading: false,
      drawer: false,
      fixed: false,
      map: null,
      title: 'Impressions Map',
      addedMarkers: [],
      dataLength: 0
    }
  },
  computed: {
    codedProgress() {
      if (this.dataLength === 0) return 0
      else return Math.trunc((this.dataMarkers.length / this.dataLength) * 100)
    },
    uncodedProgress() {
      if (this.dataLength === 0) return 0
      else
        return Math.trunc((this.uncodedMarkers.length / this.dataLength) * 100)
    },
    progress() {
      // const current = this.addedMarkers.length / this.dataLength
      // console.log('current', current)
      return Math.trunc(
        ((this.dataMarkers.length + this.uncodedMarkers.length) /
          this.dataLength) *
          100
      )
    },
    styleFunction() {
      // const fillColor = this.fillColor // important! need touch fillColor in computed for re-calculate when change fillColor
      return () => {
        return {
          weight: 2,
          color: '#A0AEC0',
          opacity: 0.5,
          fillColor: '#E2E8F0',
          fillOpacity: 0.5
        }
      }
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.tecMap
    })
  },
  methods: {
    addressNumber(address) {
      const components = address.address_components
      const matchedComponent = components.filter(
        (item) => item.types[0] === 'street_number'
      )
      if (matchedComponent[0]) return matchedComponent[0].long_name
      else return 'Check Address'
    },
    addressStreet(address) {
      const components = address.address_components
      const matchedComponent = components.filter(
        (item) => item.types[0] === 'route'
      )
      if (matchedComponent[0]) return matchedComponent[0].long_name
      else return ''
    },
    addressCity(address) {
      const components = address.address_components
      const matchedComponent = components.filter(
        (item) => item.types[0] === 'locality'
      )
      if (matchedComponent[0]) return matchedComponent[0].long_name
      else return ''
    },
    addressState(address) {
      const components = address.address_components
      const matchedComponent = components.filter(
        (item) => item.types[0] === 'administrative_area_level_1'
      )
      if (matchedComponent[0]) return matchedComponent[0].long_name
      else return ''
    },
    addressCounty(address) {
      const components = address.address_components
      const matchedComponent = components.filter(
        (item) => item.types[0] === 'administrative_area_level_2'
      )
      if (matchedComponent[0]) return matchedComponent[0].long_name
      else return ''
    },
    addressZip(address) {
      const components = address.address_components
      const matchedComponent = components.filter(
        (item) => item.types[0] === 'postal_code'
      )
      if (matchedComponent[0]) return matchedComponent[0].long_name
      else return ''
    },
    removeMarker(index) {
      this.addedMarkers.splice(index, 1)
    },
    addMarker(event) {
      if (!this.editMap) this.addedMarkers.push(event.latlng)
      else if (this.editMap) this.polyline.latlngs.push(event.latlng)
      // this.addedMarkers.push(event.latlng)
      // this.polyline.latlngs.push(event.latlng)
    },
    resetMap() {
      this.$refs.tecMap.mapObject.setView(this.originalCenter, this.zoom)
    },
    getGeo(address) {
      console.log('address', address)
      /* const searchAddress =
        address[1] + ',' + address[2] + ',' + address[3] + ',' + address[4] */

      const apiPath =
        'https://geocoding.geo.census.gov/geocoder/locations/address?street=' +
        address[1] +
        '&city=' +
        address[2] +
        '&state=' +
        address[3] +
        '&zip=' +
        address[4] +
        '&benchmark=Public_AR_Current&format=json'

      axios
        .get(apiPath, { crossdomain: true })
        .then((response) => console.log('census response', response))
    },
    getMarker(address) {
      const searchAddress =
        address[1] + ',' + address[2] + ',' + address[3] + ',' + address[4]
      console.log('searchaddress', searchAddress)

      const params = {
        key: process.env.mapApiKey,
        address: searchAddress
      }

      const apiPath = 'https://maps.googleapis.com/maps/api/geocode/json'

      const http = rateLimit(axios.create(), { maxRPS: 50 })

      http.get(apiPath, { params }).then((response) => {
        console.log('geocodeio response', response.data)
        if (response.data.results.length > 0) {
          const results = response.data.results[0]
          console.log('response.data.results', results)

          if (results.types[0] === 'street_address')
            this.dataMarkers.push(results)
          else this.uncodedMarkers.push(searchAddress)
        }
      })
    },
    upload(e) {
      // const that = this
      const fileToLoad = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const bstr = e.target.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
        this.loading = true
        this.handleMarkers(data)
        // this.handleMarkers(data)
        // this.cols = make_cols(ws['!ref'])
      }
      reader.readAsBinaryString(fileToLoad)
      /* reader.onload = (fileLoadedEvent) => {
        const file = fileLoadedEvent.target.result
        if (file.type === 'text/csv') {
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete(results) {
              console.log('papaparse results', results)
              that.handleMarkers(results.data)
            },
            error(errors) {}
          })
        } else if (
          file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          const workbook = XLSX.readFile(file)
          console.log('workbook', workbook)
        }
      }
      reader.readAsText(fileToLoad) */
    },
    handleMarkers(results) {
      // const markers = JSON.parse(this.doc)
      console.log('results', results)

      this.dataLength = results.length

      this.$nuxt.$loading.start()
      for (let i = 0; i < results.length; i++) {
        // console.log('result loop', results[i])
        this.getMarker(results[i])
        // this.getGeo(results[i])
      }
      this.$nuxt.$loading.finish()

      /* this.dataMarkers.forEach((item) => {
        this.getMarker(item)
      }) */

      /* const testMarkers = new Promise((resolve, reject) => {
        results.data.forEach((item, index) => {
          this.getMarker(item)
        })
      }).then(() => {
        const newMarkers = this.dataMarkers.map((d) => {
          return {
            id: d.LocationId,
            position: [d.DisplayPosition.Latitude, d.DisplayPosition.Longitude],
            city: d.Address.City,
            state: d.Address.State,
            county: d.Address.County,
            number: d.Address.HouseNumber,
            street: d.Address.Street
          }
        }
      })
      ) */
      /* const newMarkers = this.dataMarkers.map((d) => {
        return {
          id: d.LocationId,
          position: [d.DisplayPosition.Latitude, d.DisplayPosition.Longitude],
          city: d.Address.City,
          state: d.Address.State,
          county: d.Address.County,
          number: d.Address.HouseNumber,
          street: d.Address.Street
        }
      }) */
      /* console.log('newmarkers', newMarkers)
      this.$store.commit('SET_MARKERS', newMarkers) */
    },
    addFiles() {
      // called when file upload is clicked
      console.log('addfiles called')
      this.$refs.files.click()
    },
    handleDragDropUpload(e) {
      this.dragging = false
      const droppedFiles = e.dataTransfer.files
      for (let i = 0; i < droppedFiles.length; i++) {
        this.files.push(droppedFiles[i])
      }
    },
    onFilesAdded() {
      const uploadedFiles = this.$refs.files.files
      // add files to array
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        this.files.push(file)
      }
    }
  }
}
</script>

<style>
input[type='file'] {
  position: absolute;
  top: -500px;
}
.tooltip:after,
.tooltip:before {
  top: 250%;
  left: 250%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.tooltip:after {
  /* border-color: rgba(136, 183, 213, 0);
  border-top-color: #88b7d5; */
  border-width: 30px;
  margin-left: -30px;
}
.tooltip:before {
  /* border-color: rgba(194, 225, 245, 0);
  border-top-color: #c2e1f5; */
  border-width: 36px;
  margin-left: -36px;
}
</style>
