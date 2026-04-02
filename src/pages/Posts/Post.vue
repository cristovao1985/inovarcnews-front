<template>
  <div class="q-pa-md">
    <div v-if="loading" class="q-pa-md">
      <q-linear-progress indeterminate />
      <q-linear-progress indeterminate color="positive" class="q-mt-sm" />
      <q-linear-progress indeterminate class="q-mt-sm" />
    </div>
    <div v-else>
      <q-card v-if="!post?.title" class="q-pa-md text-center">
        <p class="text-h5">Página não econtrada</p>
        <a href="/#/">Retornar à tela principal</a>
      </q-card>
      <q-card v-else flat bordered>
        <q-card-section>
          <q-chip square class="bg-info text-primary-5" dense>{{ post?.author }} </q-chip>
          <q-item-label caption>
            {{ new Date(post.CreatedAt).toLocaleString() }} - {{ readTime(post.content) }} min de
            leitura
          </q-item-label>
        </q-card-section>
        <q-card-section>
          <div class="text-h4">{{ post?.title }}</div>
          <q-separator />
          <div class="q-mt-md">
            <span v-html="post?.content"></span>
          </div>
          <q-separator />
        </q-card-section>
        <q-card-section v-if="post.source">
          <strong>Fonte: </strong>
          <a :href="post.source" target="_blank" rel="noopener noreferrer">{{
            post.source || 'Indisponível'
          }}</a>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Responder" outline @click="openModal('comment', post.Id, {})" />
          <q-btn icon="share" flat @click="sharePost(post)" />
        </q-card-actions>
        <!-- LISTA DE COMENTÁRIOS -->
        <q-card class="q-mt-md">
          <q-card-section>
            <strong>Comentários({{ comments.length }})</strong>
          </q-card-section>

          <q-separator />
          <q-list v-for="comment in comments" :key="comment.Id">
            <q-item>
              <q-item-section
                ><q-item-label caption>
                  {{ comment.author }} - {{ new Date(comment.CreatedAt).toLocaleString() }} <br />
                </q-item-label>

                <span v-html="comment.content" />

                <div v-for="message in comment.discussion" :key="message" class="q-ml-md">
                  <q-item-label caption>
                    {{ message.author }} - {{ new Date(comment.CreatedAt).toLocaleString() }}
                  </q-item-label>
                  {{ message.content }}
                </div>
                <q-btn
                  label="Responder"
                  outline
                  @click="openModal('discussion', comment.Id, comment)"
                  flat
                  dense
                />
              </q-item-section>

              <q-item-section avatar>
                <q-btn icon="more_vert" flat dense v-if="canEdit(comment)">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item
                        clickable
                        v-close-popup
                        @click="openModal('comment', comment.Id, comment)"
                      >
                        <q-item-section>Editar</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteComment(comment.Id)">
                        <q-item-section class="text-negative"> Excluir </q-item-section>
                      </q-item>
                      <q-separator />
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-card>
    </div>

    <q-dialog v-model="showModal.comment">
      <q-card>
        <q-card-section>
          <p class="text-h5">Seu comentário</p>
          <q-form ref="form">
            <q-field
              ref="fieldRef"
              v-model="comment.content"
              label-slot
              borderless
              :rules="[(val) => (val && val.length > 20) || 'Campo obrigatório(20 caracteres)']"
            >
              <template #control>
                <q-editor
                  placeholder="Escreva seu comentário aqui..."
                  v-model="comment.content"
                  min-height="5rem"
                  class="full-width"
                  :style="fieldRef && fieldRef.hasError ? 'border-color: var(--q-negative)' : ''"
                  content-class="whitespace-pre-line"
                  :toolbar="[
                    [
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        list: 'only-icons',
                        options: ['left', 'center', 'right', 'justify'],
                      },
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        options: ['left', 'center', 'right', 'justify'],
                      },
                    ],
                    ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                    ['token', 'hr', 'link', 'custom_btn'],
                    ['print', 'fullscreen'],
                    [
                      {
                        label: $q.lang.editor.formatting,
                        icon: $q.iconSet.editor.formatting,
                        list: 'no-icons',
                        options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                      },
                      {
                        label: $q.lang.editor.fontSize,
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'size-1',
                          'size-2',
                          'size-3',
                          'size-4',
                          'size-5',
                          'size-6',
                          'size-7',
                        ],
                      },
                      {
                        label: $q.lang.editor.defaultFont,
                        icon: $q.iconSet.editor.font,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'default_font',
                          'arial',
                          'arial_black',
                          'comic_sans',
                          'courier_new',
                          'impact',
                          'lucida_grande',
                          'times_new_roman',
                          'verdana',
                        ],
                      },
                      'removeFormat',
                    ],
                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                    ['undo', 'redo'],
                    ['viewsource'],
                  ]"
                  :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana',
                  }"
                  :content-style="{ whiteSpace: 'pre-wrap' }"
                />
              </template>
            </q-field>
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" outline @click="closeModal('comment')" />
          <q-btn label="Publicar" color="positive" @click="sendComment" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showModal.discussion">
      <q-card>
        <q-card-section>
          <p class="text-h5">Seu comentário na discussão</p>
          <q-form ref="form">
            <q-field
              ref="fieldRef"
              v-model="discussion"
              label-slot
              borderless
              :rules="[(val) => (val && val.length > 20) || 'Campo obrigatório(20 caracteres)']"
            >
              <template #control>
                <q-editor
                  placeholder="Escreva seu comentário aqui..."
                  v-model="discussion"
                  min-height="5rem"
                  class="full-width"
                  :style="fieldRef && fieldRef.hasError ? 'border-color: var(--q-negative)' : ''"
                  content-class="whitespace-pre-line"
                  :toolbar="[
                    [
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        list: 'only-icons',
                        options: ['left', 'center', 'right', 'justify'],
                      },
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        options: ['left', 'center', 'right', 'justify'],
                      },
                    ],
                    ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                    ['token', 'hr', 'link', 'custom_btn'],
                    ['print', 'fullscreen'],
                    [
                      {
                        label: $q.lang.editor.formatting,
                        icon: $q.iconSet.editor.formatting,
                        list: 'no-icons',
                        options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                      },
                      {
                        label: $q.lang.editor.fontSize,
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'size-1',
                          'size-2',
                          'size-3',
                          'size-4',
                          'size-5',
                          'size-6',
                          'size-7',
                        ],
                      },
                      {
                        label: $q.lang.editor.defaultFont,
                        icon: $q.iconSet.editor.font,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'default_font',
                          'arial',
                          'arial_black',
                          'comic_sans',
                          'courier_new',
                          'impact',
                          'lucida_grande',
                          'times_new_roman',
                          'verdana',
                        ],
                      },
                      'removeFormat',
                    ],
                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                    ['undo', 'redo'],
                    ['viewsource'],
                  ]"
                  :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana',
                  }"
                  :content-style="{ whiteSpace: 'pre-wrap' }"
                />
              </template>
            </q-field>
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" outline @click="closeModal('discussion')" />
          <q-btn label="Publicar" color="positive" @click="sendCommentToDiscussion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import postsApi from 'src/api/posts/posts.api'
import commentsApi from 'src/api/comments/comments.api'
import notify from 'src/mixins/notify'
export default {
  name: 'PostPage',
  data() {
    return {
      post: {},
      comment: {
        postId: this.$route.params.id,
        author: '',
        content: '',
        userId: 1,
        discussion: [],
      },
      comments: [],
      showModal: {
        comment: false,
        discussion: false,
      },
      user: {},
      discussion: '',
      loading: true,
    }
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.post.author = this.user?.name || 'Anônimo'
    this.post.uuid = this.user?.uuid || 1
    this.comment.author = this.user?.name || 'Anônimo'
    this.comment.uuid = this.user?.uuid || 1
    if (this.$route.params.id) {
      this.fetchPost()
      this.fetchComments()
    } else {
      this.post = null
    }
  },
  mixins: [notify],
  methods: {
    async fetchPost() {
      try {
        const response = await postsApi.getPost(this.$route.params.id)
        this.post = response.data
      } catch (error) {
        console.error('Error fetching post:', error)
      }
    },
    async fetchComments() {
      try {
        const response = await commentsApi.getByPostId(this.$route.params.id)
        this.comments = response.data.list
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        this.loading = false
      }
    },
    openModal(modal, Id, comment) {
      const user = localStorage.getItem('user')
      if ((modal === 'comment' && !user) || (modal === 'discussion' && !user)) {
        this.notifyWarning('Você precisa estar logado para responder um post.')
        this.$router.push('/login')
      }

      this.comment = { ...this.comment, ...comment }

      this.showModal[modal] = true
    },
    closeModal(modal) {
      this.showModal[modal] = false
      this.comment.content = ''
    },
    async sendComment() {
      // Lógica para enviar o comentário para a API

      // Após enviar, feche o modal e atualize a lista de comentários

      if (this.comment.content && this.comment.content.length < 200) {
        if (this.comment.Id) {
          await commentsApi.update(this.comment)
        } else {
          await commentsApi.create(this.comment)
        }
        this.closeModal('comment')
        this.fetchComments()
        this.comment.content = ''
      } else {
        this.notifyWarning('Por favor, preencha o comentário com pelo menos 200 caracteres.')
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
      let minutos = palavras / 300

      return Math.max(1, Math.ceil(minutos))
    },
    canEdit(comment) {
      return this.user?.uuid === comment.uuid
    },
    deleteComment(commentId) {
      if (confirm('Tem certeza que deseja excluir este comentário?')) {
        commentsApi
          .remove(commentId)
          .then(() => {
            this.notifySuccess('Comentário excluído com sucesso!')
            this.fetchComments()
          })
          .catch(() => {
            this.notifyError('Erro ao excluir comentário.')
          })
      }
    },
    async sendCommentToDiscussion() {
      this.comment.discussion.push({
        author: this.user.name,
        CreatedAt: new Date().toISOString(),
        content: this.discussion,
      })

      try {
        await commentsApi.update(this.comment)
        this.closeModal('discussion')
      } catch (error) {
        console.log(error)
        this.notifyError('Houve um erro ao publicar seu comentário')
      }
    },
  },
}
</script>
