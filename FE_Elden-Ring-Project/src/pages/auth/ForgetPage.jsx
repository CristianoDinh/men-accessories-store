import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners";
// import styles
import "../../styles/auth/forget/forget.css";
// import assets
import image from "../../assets/forget.jpg";
import logo from "../../assets/Elden-Ring-Logo.png";
// import service
import * as AccountService from "../../service/account/account";
// import slices
import { setEmail } from "../../redux/slices/account/account";
export const ForgetPage = () => {
  // navigate
  const navigate = useNavigate();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // dispatch
  const dispatch = useDispatch();
  // mutation
  const [submitData, setSubmitData] = useState({
    email: "",
  });
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  // mutation
  const mutation = useMutation({
    mutationKey: ["forget-pass"],
    mutationFn: AccountService.forgetPasswordService,
    onMutate: () => {
      setIsPreventSubmit(true);
      setIsLoadingPage(true);
    },
    onSuccess: (response) => {
      if (response && response.code === "EMAIL_NOT_EXISTED") {
        toast.error(
          "Email not existed in our system, please check email again",
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
        setIsLoadingPage(false);
        setTimeout(() => {
          setIsPreventSubmit(false);
        }, 1500);
      } else {
        setIsPreventSubmit(false);
        setIsLoadingPage(false);
        dispatch(setEmail(submitData.email));
        navigate("/verify-email");
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
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (isPreventSubmit) {
      toast.error("On processing, try again!", {
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
    if (!submitData.email) {
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
    try {
      await mutation.mutateAsync(submitData);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="forget-container">
      <ToastContainer />
      {isLoadingPage && (
        <div className="loading">
          <SyncLoader margin={5} size={20} color="#ffffff" />
        </div>
      )}
      <div className="banner">
        <img src={image} alt="" />
      </div>
      <div className="forget">
        <div className="header">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
          <strong>Forget your password?</strong>
        </div>
        <form action="" onSubmit={handleOnSubmit} className="forget-form">
          <div className="input-item">
            <label htmlFor="">Email*</label>
            <input
              type="text"
              name="email"
              onChange={handleOnChange}
              placeholder="Enter email to recover..."
            />
          </div>
          <button>Verify email</button>
        </form>
        <div className="signin">
          <p>Just remember password?</p>
          <Link to="/login">Return to login</Link>
        </div>
      </div>
    </div>
  );
};
