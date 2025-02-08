// import pages
import { ProductManager } from "../pages/private/ProductManager";
import { AccountManager } from "../pages/private/AccountManager";
import { BlogManager } from "../pages/private/BlogManager";
import { OrderManager } from "../pages/private/OrderManager";
import { RefundManager } from "../pages/private/RefundManager";
// import wrapper
import { RoleWrapper } from "./AuthorizeWrapper";
export const privateRoutes = [
  {
    path: "/dashboard/product",
    element: (
      <RoleWrapper allowedRoles={["ADMIN"]}>
        <ProductManager />
      </RoleWrapper>
    ),
  },
  {
    path: "/dashboard/products/category/:cateId",
    element: (
      <RoleWrapper allowedRoles={["ADMIN"]}>
        <ProductManager />
      </RoleWrapper>
    ),
  },
  {
    path: "/dashboard/account",
    element: (
      <RoleWrapper allowedRoles={["ADMIN"]}>
        <AccountManager />
      </RoleWrapper>
    ),
  },
  {
    path: "/dashboard/blogs",
    element: (
      <RoleWrapper allowedRoles={["ADMIN"]}>
        <BlogManager />
      </RoleWrapper>
    ),
  },
  {
    path: "/dashboard/order",
    element: (
      <RoleWrapper allowedRoles={["ADMIN"]}>
        <OrderManager />
      </RoleWrapper>
    ),
  },
  {
    path: "/dashboard/refund",
    element: (
      <RoleWrapper allowedRoles={["ADMIN"]}>
        <RefundManager />
      </RoleWrapper>
    ),
  },
];
