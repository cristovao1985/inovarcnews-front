import { api } from 'src/boot/axios'

export default {
  getPosts(page = 1) {
    return api.get(`/mlwo1q3fk66xzcp/records?sort=-relevance&page=${page}`)
  },
  getPost(id) {
    return api.get(`/mlwo1q3fk66xzcp/records/${id}`)
  },
  getByUserId(userId) {
    return api.get(`/mlwo1q3fk66xzcp/records?where=(uuid,eq,${userId})`)
  },
  // create(post) {
  //   return api.post('/mlwo1q3fk66xzcp/records', post)
  // },
  create(post) {
    return api.post(
      'https://n8n.lineasoft.com.br/webhook/5c2d11d4-63f2-45e8-9786-b665e8b304d2',
      post,
    )
  },
}
