import React from "react";
import { Route, Routes } from "react-router-dom";

import { Layout } from "./components/layout";
import { MoreDetails } from "./components/details/Details";

import { Home } from "./pages/home/Home";
import { News } from "./pages/news/News";
import { NewsDetails } from './pages/news/NewsDetails';
import { Vacancies } from "./pages/vacancies/Vacancies";

import { smallActions } from "./context";
import { ImageGallary } from "./components/image_gallary/ImageGalary";

export const App = () => {
  return (
    <div
      className="w-screen h-screen overflow-x-hidden flex flex-col"
      onScroll={(e) => smallActions.handleScroll(e.currentTarget.scrollTop)}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="photos" element={<ImageGallary all={true} />} />
          <Route path="news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetails />} />
          <Route path="vacancies" element={<Vacancies />} />
          <Route path="details/:key/:id" element={<MoreDetails />} />
        </Route>
      </Routes>
    </div>
  );
};
