import axios from 'axios'
export const base_url = 'http://localhost:8001'
export const course_url = "http://localhost:8003"

export const $api = axios.create({
    withCredentials: true,
    baseURL: base_url,
})