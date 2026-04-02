<template>
  <q-page class="q-ma-md">
    <h5>{{ account.name }}</h5>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
    >
      <q-tab name="profile" label="Perfil" />
      <q-tab name="posts" label="Postagens" />
      <q-tab name="comments" label="Comentários" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="profile">
        <q-input type="textarea" v-model="account.description" label="Descrição" outlined />
        <q-card-actions align="right">
          <q-btn label="Atualizar Descrição" color="positive" @click="update" />
        </q-card-actions>
      </q-tab-panel>
      <q-tab-panel name="posts">
        <div v-for="post in posts" :key="post.Id">
          {{ post.title }}
        </div>
      </q-tab-panel>
      <q-tab-panel name="comments">
        <div v-for="comment in comments" :key="comment.Id">
          {{ comment.content }}
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import usersApi from 'src/api/users/users.api'
import notify from 'src/mixins/notify'
import postsApi from 'src/api/posts/posts.api'
import commentsApi from 'src/api/comments/comments.api'
export default {
  name: 'ProfilePage',
  data() {
    return {
      tab: 'profile',
      account: {},
      posts: [],
      comments: [],
    }
  },
  mixins: [notify],
  created() {
    // Aqui você pode adicionar lógica para carregar os dados do perfil do usuário
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      this.notifyWarning('Você precisa estar logado para acessar o perfil.')
      this.$router.push({ name: 'login' })
      return
    }
    this.account = user
    this.getPosts()
    this.getComments()
  },
  methods: {
    // Métodos relacionados ao perfil do usuário podem ser adicionados aqui }
    async update() {
      try {
        await usersApi.update(this.account)
        localStorage.setItem('user', JSON.stringify(this.account))
        this.notifySuccess('Perfil atualizado com sucesso!')
      } catch (error) {
        console.log(error)

        this.notifyError('Erro ao atualizar perfil. Tente novamente mais tarde.')
      }
    },
    async getPosts() {
      const data = await postsApi.getByUserId(this.account.uuid)
      this.posts = data.data.list
    },
    async getComments() {
      // Lógica para carregar os comentários do usuário
      const data = await commentsApi.getByUserId(this.account.uuid)
      this.comments = data.data.list
    },
  },
}
</script>
