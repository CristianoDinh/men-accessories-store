// import pages
import { App } from "../App";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";
import { ForgetPage } from "../pages/auth/ForgetPage";
import { ShopPage } from "../pages/public/ShopPage";
import { ProductDetail } from "../pages/public/ProductDetail";
import { CartPage } from "../pages/public/CartPage";
import { CheckoutPage } from "../pages/public/CheckoutPage";
import { BlogPage } from "../pages/public/BlogPage";
import { BlogDetailPage } from "../pages/public/BlogDetailPage";
import { ProfileSettingPage } from "../pages/public/ProfileSettingPage";
import { SecuritySettingPage } from "../pages/public/SecuritySettingPage";
import { CustomerOrderPage } from "../pages/public/CustomerOrderPage";
import { VerifyPage } from "../pages/auth/VerifyPage";
import { ResetPassPage } from "../pages/auth/ResetPassPage";
import { BuynowPage } from "../pages/public/BuynowPage";
import { PaymentSuccess } from "../pages/public/PaymentSuccess";
import { PaymentBuySuccess } from "../pages/public/PaymentBuySuccess";
import { PaymentCancel } from "../pages/public/PaymentCancel";
import { PaymentError } from "../pages/public/PaymentError";
import { NotAuthorizePage } from "../pages/public/NotAuthorizePage";
import { About } from "../pages/public/About";
// wrapper
import {
  LoggedWrapper,
  GuestWrapper,
  NonAdminWrapper,
} from "./AuthorizeWrapper";
export const publicRoutes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: (
      <LoggedWrapper>
        <LoginPage />
      </LoggedWrapper>
    ),
  },
  {
    path: "/signup",
    element: (
      <LoggedWrapper>
        <SignupPage />
      </LoggedWrapper>
    ),
  },
  {
    path: "/forget",
    element: (
      <LoggedWrapper>
        <ForgetPage />
      </LoggedWrapper>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <LoggedWrapper>
        <VerifyPage />
      </LoggedWrapper>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <LoggedWrapper>
        <ResetPassPage />
      </LoggedWrapper>
    ),
  },
  {
    path: "/shop",
    element: <ShopPage />,
  },
  {
    path: "/shop/category/:cateId",
    element: <ShopPage />,
  },
  {
    path: "/productdetail/:productId",
    element: <ProductDetail />,
  },
  {
    path: "/not-authorized",
    element: <NotAuthorizePage />,
  },
  {
    path: "/cart",
    element: (
      <GuestWrapper>
        <NonAdminWrapper>
          <CartPage />
        </NonAdminWrapper>
      </GuestWrapper>
    ),
  },
  {
    path: "/checkout",
    element: (
      <GuestWrapper>
        <NonAdminWrapper>
          <CheckoutPage />
        </NonAdminWrapper>
      </GuestWrapper>
    ),
  },
  {
    path: "/payment/success",
    element: (
      <GuestWrapper>
        <NonAdminWrapper>
          <PaymentSuccess />
        </NonAdminWrapper>
      </GuestWrapper>
    ),
  },
  {
    path: "/payment/successbuy",
    element: (
      <GuestWrapper>
        <NonAdminWrapper>
          <PaymentBuySuccess />
        </NonAdminWrapper>
      </GuestWrapper>
    ),
  },
  {
    path: "/payment/cancel",
    element: (
      <GuestWrapper>
        <NonAdminWrapper>
          <PaymentCancel />
        </NonAdminWrapper>
      </GuestWrapper>
    ),
  },
  {
    path: "/payment/error",
    element: (
      <GuestWrapper>
        <NonAdminWrapper>
          <PaymentError />
        </NonAdminWrapper>
      </GuestWrapper>
    ),
  },
  {
    path: "/buynow/:productId",
    element: <BuynowPage />,
  },
  {
    path: "/blogs",
    element: <BlogPage />,
  },
  {
    path: "/blogdetail/:blogId",
    element: <BlogDetailPage />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/setting/profile",
    element: (
      <GuestWrapper>
        <ProfileSettingPage />
      </GuestWrapper>
    ),
  },
  {
    path: "/setting/security",
    element: (
      <GuestWrapper>
        <SecuritySettingPage />
      </GuestWrapper>
    ),
  },
  {
    path: "/setting/my-order",
    element: (
      <GuestWrapper>
        <CustomerOrderPage />
      </GuestWrapper>
    ),
  },
];
