import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import styles
import "../../styles/auth/login/login.css";
// import assets
import image from "../../assets/login.jpg";
import logo from "../../assets/Elden-Ring-Logo.png";
// import service
import * as AccountService from "../../service/account/account";
import { useGoogleLogin } from "@react-oauth/google";
import { SyncLoader } from "react-spinners";
export const LoginPage = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // navigate
  const navigate = useNavigate();
  // state
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitData, setSubmitData] = useState({
    email: "",
    password: "",
  });
  // mutation
  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: AccountService.loginService,
    onMutate: () => {
      setIsLoadingPage(true);
    },
    onSuccess: (response) => {
      if (response && response.code === "USERNAME_OR_PASSWORD_WRONG") {
        toast.error("Wrong email or password, try again", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: { width: "400px" },
        });
        setIsLoadingPage(false);
      } else if (response?.code === "USER_INACTIVE") {
        toast.error("Your account is Blocked now, please contact to admin!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: { width: "400px" },
        });
        setIsLoadingPage(false);
      } else {
        toast.success("Login successful, redirect to homepage", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: { width: "400px" },
        });
        setTimeout(() => {
          setIsLoadingPage(false);
          navigate("/");
        }, 1500);
      }
    },
  });
  // handle func
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSubmitData({
      ...submitData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitData.email || !submitData.password) {
      toast.error("Please input all fields", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { width: "400px" },
      });
      return;
    }
    if (!emailPattern.test(submitData.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { width: "400px" },
      });
      return;
    }
    if (submitData.password.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { width: "400px" },
      });
      return;
    }

    try {
      await mutation.mutateAsync(submitData);
    } catch (error) {
      console.log(error);
    }
  };
  const oauthMutation = useMutation({
    mutationKey: ["oauth"],
    mutationFn: AccountService.oauthService,
    onMutate: () => {
      setIsLoadingPage(true);
    },
    onSuccess: (response) => {
      if (response?.code === "EMAIL_EXISTED") {
        toast.error("Email existed, try another email", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: { width: "400px" },
        });
        setIsLoadingPage(false);
      } else if (response?.code === "USER_INACTIVE") {
        toast.error("Your account is Blocked now, please contact to admin!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: { width: "400px" },
        });
        setIsLoadingPage(false);
      } else {
        toast.success("Login successful, redirect to homepage", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: { width: "400px" },
        });
        setTimeout(() => {
          setIsLoadingPage(false);
          navigate("/");
        }, 1500);
      }
    },
  });
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      const googleIdToken = credentialResponse.access_token;
      oauthMutation.mutateAsync(googleIdToken);
    },
  });
  return (
    <div className="login-container">
      {isLoadingPage && (
        <div className="loading">
          <SyncLoader margin={5} size={20} color="#ffffff" />
        </div>
      )}
      <ToastContainer />
      <div className="banner">
        <img src={image} alt="" />
      </div>
      <div className="login">
        <div className="header">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
          <strong>Welcome to EldenRing</strong>
        </div>
        <form action="" onSubmit={handleSubmit} className="login-form">
          <div className="input-item">
            <label htmlFor="">Email*</label>
            <input
              type="text"
              name="email"
              onChange={handleOnChange}
              placeholder="Enter email..."
            />
          </div>
          <div className="input-item">
            <label htmlFor="">Password*</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password..."
              name="password"
              onChange={handleOnChange}
            />
          </div>
          <div className="forget">
            <p onClick={togglePasswordVisibility}>
              {showPassword ? "Hide password" : "Show password"}
            </p>
            <Link to="/forget">Forget password?</Link>
          </div>
          <button>Sign in</button>
        </form>
        <div className="or">
          <p>or</p>
        </div>
        <div className="oauth" onClick={handleGoogleLogin}>
          <i className="bx bxl-google"></i>
          <p>Sign in by Google</p>
        </div>
        <div className="signup">
          <p>Don't have an account?</p>
          <Link to="/signup">Create new account</Link>
        </div>
      </div>
    </div>
  );
};
