export const url = "http://localhost:5000/api";

//https://backend-k8uf2zzn9-sj-kumar.vercel.app/api

export const setHeaders = () => {
  const headers = {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  return headers;
};
