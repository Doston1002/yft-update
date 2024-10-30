import { useState } from "react";

import { UsersContext, ScrollContext } from "./context";

export let newsActions = null;
export let smallActions = null;
export let userActions = null;
export const baseUrl = "https://coral-app-bsinx.ondigitalocean.app";
// export const baseUrl = "http://localhost:5001";

export const UsersProvider = ({ children }) => {
  // Scroll value handled here
  const [scrollValue, setScrollValue] = useState(0);

  // Fetching results here
  const [news, setNews] = useState([]);
  const [newById, setNewById] = useState({});
  const [vacancys, setVacancys] = useState([]);
  const [vacancyById, setVacancyById] = useState({});
  const [users, setUsers] = useState([]);
  const [media, setMedia] = useState([]);
  const [banner, setBanner] = useState([]);
  const [photos, setPhotos] = useState([]);

  // Action states for UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState(false);
  const [modalClose, setModalClose] = useState(false);

  const config = {
    "Content-type": "application/json",
    token: localStorage.getItem("token"),
  };

  smallActions = {
    handleScroll: (newValue) => {
      setScrollValue(newValue);
    },
    getMedia: async (url) => {
      setIsLoading(true);
      const data = (
        await fetch(`${baseUrl}/${url}`, { headers: config })
      ).json();
      data.then((res) => {
        if (res.success) {
          setMedia(res.data);
          setIsLoading(false);
        } else {
          setError(true);
          setIsLoading(false);
          setMedia([]);
        }
      });
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    },

    getBanner: async (url) => {
      setIsLoading(true);
      const data = (
        await fetch(`${baseUrl}/${url}`, { headers: config })
      ).json();
      data.then((res) => {
        if (res.success) {
          setBanner(res.data);
          setIsLoading(false);
        } else {
          setError(true);
          setIsLoading(false);
          setBanner([]);
        }
      });
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    },

    getPhotos: async (url) => {
      setIsLoading(true);
      const data = (
        await fetch(`${baseUrl}/${url}`, { headers: config })
      ).json();
      data.then((res) => {
        if (res.success) {
          setPhotos(res.data);
          setIsLoading(false);
        } else {
          setError(true);
          setIsLoading(false);
          setApplication([]);
        }
      });
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    },
  };

  newsActions = {
    getNews: async (url) => {
      setIsLoading(true);
      const data = (
        await fetch(`${baseUrl}/${url}`, { headers: config })
      ).json();
      data.then((res) => {
        if (res.success) {
          if (url === "news/all") {
            setNews(res.data);
          } else {
            setVacancys(res.data);
          }
          setIsLoading(false);
        } else {
          setError(true);
          setIsLoading(false);
          setNews([]);
        }
      });
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    },

    getNewById: async (url) => {
      setIsLoading(true);
      const data = (
        await fetch(`${baseUrl}/${url}`, { headers: config })
      ).json();
      data.then((res) => {
        if (res.success) {
          if (url === "news/add") {
            setNewById(res.data);
          } else {
            setVacancyById(res.data);
          }
          setIsLoading(false);
        } else {
          setError(true);
          setNewById({});
          setVacancyById({});
          setIsLoading(false);
        }
      });
    },
  };

  return (
    <UsersContext.Provider
      value={{
        scrollValue,
        news,
        newById,
        vacancys,
        vacancyById,
        isLoading,
        error,
        alert,
        modalClose,
        users,
        media,
        banner,
        photos,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const ScrollProvider = ({ children }) => {
  const [scrollValue, setScrollValue] = useState(0);

  smallActions = {
    handleScroll: (newValue) => {
      setScrollValue(newValue);
    },
  };

  return (
    <ScrollContext.Provider value={scrollValue}>
      {children}
    </ScrollContext.Provider>
  );
};
