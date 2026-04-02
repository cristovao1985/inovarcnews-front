<template>
  <q-page class="q-ma-md">
    <span v-html="data.content"></span>
  </q-page>
</template>

<script>
import aboutApi from '../../api/about/about.api'
export default {
  name: 'AboutPage',
  data() {
    return {
      data: {},
    }
  },
  created() {
    this.getLastAboutContent()
  },
  methods: {
    async getLastAboutContent() {
      const res = await aboutApi.getAbout()
      this.data = res.data.list[0]
    },
  },
}
</script>
