import axios from "axios";


export const ADMIN_API_URL = "http://localhost:5000/admin";

interface Userdata{
    _id:string,
    name:string,
    phone:number,
    email:string,
    password:string,
    profileImage:string
}

export const loginAdmin = async (email:string,password:string)=>{
    const response = await axios.post(`${ADMIN_API_URL}/login`,{email,password})
    return response.data
}
export const createUserAPI =async (userData:Userdata)=>{
    try {
        const response = await axios.post(`${ADMIN_API_URL}/createUser`,userData)
        return response 
    } catch (error) {
        console.error("error catching user:",error);
        throw error 
    }
}

export const udpateUserAPI = async (userData:Userdata,token:string |undefined)=>{
    try {
      const response = await axios.put(`${ADMIN_API_URL}/updateUser/${userData._id}`,userData,
        {
            headers:{
               Authorization:`Bearer ${token}`
            }
        })
        return response  
    } catch (error) {
        console.error("Error updating user:",error);
        throw error 
    }
}

export const deleteUserAPI =async (userID:string,token:string |undefined)=>{
    try {
        const response = await axios.delete(`${ADMIN_API_URL}/deleteUser/${userID}`, 
            {
                headers:{
                 Authorization:`Bearer ${token}`
                }
            }
        )
        return response
        console.log("rees",response);
        
    } catch (error) {
        console.error("Error updating error:",error);
        throw error
    }
}