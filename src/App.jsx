import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import useLenis from "./hooks/use-lenis";
import Preloader from "./components/ui/preload";

function App() {
  useLenis();
  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Preloader />
    </>
  );

}

export default App;
