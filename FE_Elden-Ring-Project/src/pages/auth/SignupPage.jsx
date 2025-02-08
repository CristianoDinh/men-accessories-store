import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import assets
import image from "../../assets/signup.jpg";
import logo from "../../assets/Elden-Ring-Logo.png";
// import styles
import "../../styles/auth/signup/signup.css";
// import service
import * as AccountService from "../../service/account/account";
import { useGoogleLogin } from "@react-oauth/google";
import { SyncLoader } from "react-spinners";
export const SignupPage = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // navigate
  const navigate = useNavigate();
  // state
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [submitData, setSubmitData] = useState({
    email: "",
    fullName: "",
    password: "",
    repass: "",
  });
  // mutation
  const mutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: AccountService.signupService,
    onMutate: () => {
      setIsLoadingPage(true);
    },
    onSuccess: (response) => {
      if (response && response.code === "EMAIL_EXISTED") {
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
        setTimeout(() => {
          setIsLoadingPage(false);
        }, 1500);
      } else {
        toast.success("Signup successful, redirect to login page", {
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
          navigate("/login");
        }, 1500);
      }
    },
  });
  // handle func
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSubmitData({
      ...submitData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !submitData.email ||
      !submitData.password ||
      !submitData.fullName ||
      !submitData.repass
    ) {
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
    if (submitData.password.length < 8 || /\s/.test(submitData.password)) {
      toast.error(
        "Password must be at least 8 characters long and must not contain spaces",
        {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: { width: "400px" },
        }
      );
      return;
    }
    if (submitData.password !== submitData.repass) {
      toast.error("Password and confirm password must be same", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { width: "500px" },
      });
      return;
    }
    if (submitData.fullName.trim() === "") {
      toast.error("Full name cannot be only spaces", {
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
      if (response && response.code === "EMAIL_EXISTED") {
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
    <div className="signup-container">
      {isLoadingPage && (
        <div className="loading">
          <SyncLoader margin={5} size={20} color="#ffffff" />
        </div>
      )}
      <ToastContainer />
      <div className="signup">
        <div className="header">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
          <strong>Welcome to EldenRing</strong>
        </div>
        <form action="" onSubmit={handleSubmit} className="signup-form">
          <div className="input-item">
            <label htmlFor="">Your name*</label>
            <input
              type="text"
              name="fullName"
              onChange={handleOnChange}
              placeholder="Enter your fullname..."
            />
          </div>
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
              type="password"
              name="password"
              onChange={handleOnChange}
              placeholder="Enter password..."
            />
          </div>
          <div className="input-item">
            <label htmlFor="">Confirm password*</label>
            <input
              type="password"
              name="repass"
              onChange={handleOnChange}
              placeholder="Enter password again..."
            />
          </div>
          <button>Create new account</button>
        </form>
        <div className="or">
          <p>or</p>
        </div>
        <div className="oauth" onClick={handleGoogleLogin}>
          <i className="bx bxl-google"></i>
          <p>Sign up by Google</p>
        </div>
        <div className="signin">
          <p>Already have account?</p>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
      <div className="banner">
        <img src={image} alt="" />
      </div>
    </div>
  );
};
