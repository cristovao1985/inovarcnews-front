<template>
  <div class="q-pa-md">
    <q-dialog v-model="show">
      <q-card class="q-pa-md">
        <p class="text-h5">Publicar novo conteúdo</p>

        <q-checkbox
          label="Esta publicação é uma vaga de trabalho"
          v-model="post.type"
          true-value="job"
          false-value="post"
          dense
        ></q-checkbox>
        <br />
        <br />
        <q-form class="q-gutter-md" ref="form">
          <q-input
            outlined
            label="Título"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
            v-model="post.title"
            placeholder="ex: O futuro da tecnologia: tendências para os próximos anos"
          ></q-input>

          <q-field
            ref="fieldRef"
            v-model="post.content"
            label-slot
            borderless
            :rules="[
              (val) => (val && val.length > 200) || 'Campo obrigatório(Mínimo200 caracteres)',
            ]"
          >
            <template #control>
              <q-editor
                placeholder="Escreva seu conteúdo aqui..."
                v-model="post.content"
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

          <q-input
            filled
            label="Fonte"
            v-model="post.source"
            placeholder="ex: https://site.com/noticia"
          ></q-input>
        </q-form>
        <q-separator spaced />
        <q-item-label caption
          >Sua postagem passará por uma revisão antes de ser publicada.</q-item-label
        >
        <q-card-actions align="right">
          <q-btn label="Cancelar" outline to="/"></q-btn>
          <q-btn label="Publicar" color="positive" @click="publishPost" :loading="loading"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import postsApi from 'src/api/posts/posts.api'
import notify from '../../mixins/notify'
export default {
  name: 'PublishPage',
  data() {
    return {
      show: true,
      post: {
        title: '',
        content: null,
        author: '',
        uuid: '',
        source: '',
        type: 'post',
      },
      user: {},
      loafing: false,
    }
  },
  mixins: [notify],
  created() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.post.author = this.user?.name || 'Anônimo'
    this.post.uuid = this.user?.uuid || 1

    if (!localStorage.getItem('user')) {
      this.notifyWarning('Você precisa estar logado para publicar um conteúdo.')
      this.$router.push('/login')
    }
  },
  methods: {
    async publishPost() {
      try {
        this
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.notifySuccess(
              'Postagem enviada com sucesso. Ela passará por uma revisão e será publicada em breve!',
            )
            postsApi
              .create(this.post)
              .then(() => {
                this.$router.push('/')
              })
              .catch(() => {
                this.notifyError('Erro ao publicar postagem.')
              })
          } else {
            this.notifyWarning('Por favor, preencha todos os campos.')
          }
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
