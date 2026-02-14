import axios from 'axios'

export const base_url = "http://localhost:8001"
export const purchase_url = "http://localhost:8002"
export const course_url = "http://localhost:8003"
export const reviews_url = "http://localhost:8004"

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export const $api = axios.create({
    withCredentials: true,
    baseURL: base_url,
})