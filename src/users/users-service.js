import axios from "axios";

const USER_API_URL = 'http://localhost:4000/users'
const BASE_API_URL = 'http://localhost:4000'

const api = axios.create({ withCredentials: true });

export const getMyRecipes = async () => {
    const response = await api.get(`${BASE_API_URL}/myRecipes`)
    return response.data
}

export const getChefRecipes = async (uid) => {
    const response = await api.get(`${BASE_API_URL}/chefRecipes/${uid}`)
    return response.data
}

export const findUserById = async (uid) => {
    const response = await api.get(`${USER_API_URL}/${uid}`)
    const user = response.data
    return user
}

export const getMyRecommends = async () => {
    const response = await api.get(`${BASE_API_URL}/myRecommends`)
    return response.data
}
export const getMyLikes = async () => {
    const response = await api.get(`${BASE_API_URL}/myLikes`)
    return response.data
}

export const register = async (user) => {
    const response = await api.post(`${BASE_API_URL}/register`, user)
    const newUser = response.data
    return newUser
}

export const login = async (user) => {
    const response = await api.post(`${BASE_API_URL}/login`, user)
    return response.data
}

export const logout = async () => {
    const response = await api.post(`${BASE_API_URL}/logout`)
    return response.data
}
export const profile = async () => {
    const response = await api.post(`${BASE_API_URL}/profile`)
    return response.data
}

export const findAllUsers = async () => {
    const response = await axios.get(USER_API_URL)
    return response.data
}

export const createUser = () => {

}

const deleteUser = () => { }
export const updateUser = async (params) => {
    const response = await api.put(`${BASE_API_URL}/users/${params.uid}`, params.body)
    return response.data
}

export const getMyFollowedChef = async () => {
    const response = await api.get(`${BASE_API_URL}/myFollowedChef`)
    return response.data
}
