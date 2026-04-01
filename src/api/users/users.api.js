import { api } from 'src/boot/axios'

export default {
  login: (uudi) => {
    return api.get(`/m2muf765hwxi0h8/records?where=(uuid,eq,${uudi})`)
  },
  validateNickName: (name) => {
    return api.get(`/m2muf765hwxi0h8/records?where=(name,eq,${name})`)
  },
  create: (user) => {
    return api.post('/m2muf765hwxi0h8/records', user)
  },
  update: (user) => {
    delete user.CreatedAt
    delete user.UpdatedAt
    return api.patch(`/m2muf765hwxi0h8/records`, user)
  },
}
