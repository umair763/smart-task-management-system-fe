import "react-toastify/dist/ReactToastify.css";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/store";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import useLenis from "./hooks/use-lenis";
import Preloader from "./components/ui/preload";

function App() {
  useLenis();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={routes} />

        <ToastContainer position="top-right" autoClose={3000} />
        <Preloader />
      </PersistGate>
    </Provider>
  );
}

export default App;
