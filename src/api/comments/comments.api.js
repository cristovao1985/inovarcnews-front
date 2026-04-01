import { api } from 'src/boot/axios'

export default {
  getByPostId(id) {
    return api.get(`/mnwus0j6xu0ex2y/records?where=(postId,eq,${id})`)
  },
  create(comment) {
    return api.post('/mnwus0j6xu0ex2y/records', comment)
  },
  update(comment) {
    delete comment.CreatedAt
    delete comment.UpdatedAt
    return api.patch(`/mnwus0j6xu0ex2y/records`, comment)
  },
  remove(Id) {
    const data = {
      Id,
    }
    return api.delete(`/mnwus0j6xu0ex2y/records`, { data })
  },
  getByUserId(userId) {
    return api.get(`/mnwus0j6xu0ex2y/records?where=(uuid,eq,${userId})`)
  },
}
