import axios from 'axios'

// No hardcoded Content-Type here on purpose: axios auto-sets
// "application/json" for plain object bodies and the correct
// "multipart/form-data; boundary=..." for FormData bodies (used by the
// file/thumbnail/banner upload endpoints). A fixed header here would break
// multipart uploads by overriding the boundary axios needs to set itself.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export default api
