import { api } from 'src/boot/axios'

export default {
  getAbout() {
    return api.get(`/mz33xdwjfk28zry/records?sort=-version`)
  },
}
