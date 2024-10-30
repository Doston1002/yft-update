export const fetchApi = async (url, data) => {
  try {
    const res = await fetch(`https://coral-app-bsinx.ondigitalocean.app/${url}`, data);
    // const res = await fetch(`http://localhost:5001/${url}`, data);
    return res.ok ? res.json() : res;
  } catch ({ message }) { 
    return message;
  }
};
