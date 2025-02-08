import { createBrowserRouter } from "react-router-dom";
// import routes
import { publicRoutes } from "./PublicRoute";
import { privateRoutes } from "./PrivateRoute";
const routes = [...publicRoutes, ...privateRoutes];

const router = createBrowserRouter(routes);

export default router;
