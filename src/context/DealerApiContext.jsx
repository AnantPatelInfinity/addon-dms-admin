import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { DX_URL } from '../config/baseUrl';

const DealerApiContext = createContext();

export const useDealerApi = () => useContext(DealerApiContext);

const api = axios.create({
    baseURL: DX_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const API_DX_ROLES_TOKEN = {
    dealer: "DX_DL_TOKEN",
    company: "DX_COM_TOKEN",
}

api.interceptors.request.use(
    (config) => {
      
      let token = localStorage.getItem("DX_DL_TOKEN");
  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export const ApiDealerProvider = ({ children }) => {
    const get = async (url, config = {}) => {
        const response = await api.get(url, config);
        return response.data;
    };

    const post = async (url, data, config = {}) => {
        const response = await api.post(url, data, config);
        return response.data;
    };

    const uploadImage = async (url, imageFile, config = {}) => {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await api.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                ...config.headers,
            },
            ...config,
        });
        return response.data;
    };

    const deleteById = async (url, id, config = {}) => {
        const response = await api.delete(`${url}/${id}`, config);
        return response.data;
    };

    const uploadMultipleImages = async (url, imageFiles = [], config = {}) => {
        console.log(imageFiles, 'IMGFILES')
        const formData = new FormData();
        imageFiles.forEach((file) => {
            formData.append("images", file);
        });

        const response = await api.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                ...config.headers,
            },
            ...config,
        });

        return response.data;
    };

    return (
        <DealerApiContext.Provider value={{ get, post, uploadImage, deleteById, uploadMultipleImages }}>
            {children}
        </DealerApiContext.Provider>
    );
}