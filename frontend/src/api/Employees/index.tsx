import axios from "axios";

const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("token");
    }
    return null;
};

// Configuration axios avec intercepteur pour le token
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Intercepteur pour ajouter le token à chaque requête
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let Employees: any = {};

Employees.getAllEmployees = async () =>{
    return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/employees`)
}
Employees.UpdateEmployee = async (id: number, data: any) =>{
    return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/employee/employee/edit/${id}`, data)
}
Employees.addEmployee=async (data: any) =>{
    return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employee/employee/create`, data)
}
Employees.deleteEmployee=async (id: number) =>{
    return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/employee/employee/delete/${id}`)
}
Employees.AssignEmployeeToLavage=async (data: any) =>{
    return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employee/station/assign`, data)
}


export default Employees;

