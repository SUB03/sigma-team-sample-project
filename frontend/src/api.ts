import axios from 'axios'
import { base_url } from './constants/api'

export const $api = axios.create({
    withCredentials: true,
    baseURL: base_url,
})