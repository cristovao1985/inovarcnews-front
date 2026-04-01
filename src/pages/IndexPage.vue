<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          narrow-indicator
        >
          <q-tab name="posts" label="Postagens Recentes" />
          <q-tab name="jobs" label="Vagas de Emprego" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="posts">
            <div v-if="!posts?.length">
              <h5>Nenhuma postagem encontrada.</h5>
            </div>
            <div v-for="post in posts" :key="post.Id">
              <a :href="`/#/post/${post.Id}`" target="_self">{{ post.title }}</a>
              <q-item-label caption
                >{{ post.author }} - {{ new Date(post.CreatedAt).toLocaleString() }}</q-item-label
              >
              <q-separator spaced />
            </div>
          </q-tab-panel>

          <q-tab-panel name="jobs">
            <div v-if="!jobs?.length">
              <h5>Nenhuma vaga encontrada.</h5>
            </div>
            <div v-for="job in jobs" :key="job.Id">
              <a :href="`/#/post/${job.Id}`" target="_self">{{ job.title }}</a>
              <q-item-label caption
                >{{ job.author }} - {{ new Date(job.CreatedAt).toLocaleString() }}</q-item-label
              >
              <q-separator spaced />
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <q-card-actions align="center">
          <q-btn label="Anterior" flat @click="loadLess" v-if="currentPage != 1" />
          <q-btn label="Próximo" flat @click="loadMore" v-if="pageInfo.totalRows > 25" />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import postsApi from 'src/api/posts/posts.api'
import notify from 'src/mixins/notify'
export default {
  name: 'PageIndex',
  data() {
    return {
      tab: 'posts',
      posts: [],
      jobs: [],
      currentPage: 1,
      pageInfo: {
        isFirstPage: true,
        isLastPage: true,
        page: 1,
        pageSize: 25,
        totalRows: 9,
      },
    }
  },
  created() {
    this.fetchPosts()
  },
  watch: {
    currentPage() {
      this.fetchPosts()
    },
  },
  mixins: [notify],
  methods: {
    async fetchPosts() {
      try {
        const response = await postsApi.getPosts(this.currentPage)
        this.pageInfo = response.data.pageInfo
        response.data.list.forEach((post) => {
          if (post.type === 'job') {
            this.jobs.push(post)
          } else {
            this.posts.push(post)
          }
        })
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    },
    sharePost(post) {
      const postUrl = `${window.location.origin}/#/post/${post.Id}`
      navigator.clipboard
        .writeText(postUrl)
        .then(() => {
          this.notifyInfo('Link copiado para a área de transferência!')
        })
        .catch((err) => {
          console.error('Error copying link:', err)
          this.notifyError('Erro ao copiar o link.')
        })
    },
    readTime(content) {
      const palavras = content.trim().split(/\s+/).length
      const minutos = Math.ceil(palavras / 200)
      return minutos
    },
    loadMore() {
      this.currentPage++
    },
    loadLess() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
  },
}
</script>
