import axios from "axios"
import express from "express"

const fetchNewsApi = async (req, res) => {

  const { country, category,q,page, pageSize, apiKey } = req.query; // Receive params from request body
  

  try {
    // if(q===""){
    //   const response = await axios.get(`https://newsapi.org/v2/top-headlines?q=${q}&country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`);
    //   res.json(response.data);
    // }
    // else{
    //   const response = await axios.get(`https://newsapi.org/v2/everything?q=${q}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`);
    //   res.json(response.data);
    // }
    
    const response = await axios.get(`https://newsapi.org/v2/everything?q=tesla&from=2025-02-23&sortBy=publishedAt&apiKey=a1644811b3494e189d0426792491cf87`);
    res.json(response.data);
    
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message
    });
  }
};


const fetchNewsApiSearch = async (req, res) => {

  const { country, category,q,page, pageSize, apiKey } = req.query; // Receive params from request body
  

  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?q=${q}&country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`);
    // const response = await axios.get(`https://newsapi.org/v2/everything?q=tesla&from=2025-02-23&sortBy=publishedAt&apiKey=a1644811b3494e189d0426792491cf87`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message
    });
  }
};

export { fetchNewsApi ,fetchNewsApiSearch};