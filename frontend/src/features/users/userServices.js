

export const fetchUsers = async(AxiosPrivate) => {
    const response = await AxiosPrivate.get('users/')
    return response.data
}

export const addUser = async (AxiosPrivate, userData) => {
  console.log(' receive data',userData )
  const config = {
    headers: {
        "Content-Type": "multipart/form-data",
    },
};
    const response  = await AxiosPrivate.post('adduser/',userData, config)
    return response.data
}

export const EidteUser = async (AxiosPrivate, userData) => {
  console.log(' receive data', userData)
    const config = {
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
  };
      const response  = await AxiosPrivate.put(`user/${userData.phone}/`,userData, config)
      return response.data
}

  export const deleteUser = async (AxiosPrivate, phone) => {

    const response  = await AxiosPrivate.delete(`user/${phone}/`)
    return response.data
}



const userServices = { fetchUsers, addUser, EidteUser, deleteUser}
export default userServices