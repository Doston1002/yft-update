import { Outlet } from "react-router-dom";
import { Navbar as Header } from "../../components/header/Navbar";
import { Footer } from "../../components/footer/Footer";

export const Layout = () => {
  return (
    <>
      <Header />
      <main className="flex-auto">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
