import axios from 'axios'
export const base_url = ''
export const purchase_url = ""
export const course_url = ""
export const reviews_url = ""

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export const $api = axios.create({
    withCredentials: true,
    baseURL: base_url,
})