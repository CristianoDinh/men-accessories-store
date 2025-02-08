import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";

// import styles
import "../../styles/auth/reset/reset.css";
// import assets
import image from "../../assets/reset.jpg";
import logo from "../../assets/Elden-Ring-Logo.png";
// import service
import * as AccountService from "../../service/account/account";
export const ResetPassPage = () => {
  // navigate
  const navigate = useNavigate();
  // selector
  const otp = useSelector((state) => state.account.otp.otp);
  const email = useSelector((state) => state.account.email.email);
  // state
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitData, setSubmitData] = useState({
    email: email,
    password: "",
    repass: "",
  });
  // mutation
  const mutation = useMutation({
    mutationKey: ["reset-pass"],
    mutationFn: AccountService.resetPassword,
    onMutate: () => {
      setIsLoadingPage(true);
    },
    onSuccess: () => {
      toast.success("Reset password successful, redirecting to login page", {
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
      setTimeout(() => {
        location.reload();
      }, 1500);
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
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!submitData.password || !submitData.repass) {
      toast.error("Please enter all fields", {
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
    if (submitData.password !== submitData.repass) {
      toast.error("New password and confirm password must be same", {
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
    try {
      await mutation.mutateAsync(submitData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!otp || !email) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="reset-container">
      {isLoadingPage && (
        <div className="loading">
          <SyncLoader margin={5} size={20} color="#ffffff" />
        </div>
      )}
      <ToastContainer />
      <div className="banner">
        <img src={image} alt="" />
      </div>
      <div className="reset">
        <div className="header">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
          <strong>Reset Your Password</strong>
        </div>
        <form action="" onSubmit={handleOnSubmit} className="reset-form">
          <div className="input-item">
            <label htmlFor="">New password*</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password..."
              name="password"
              onChange={handleOnChange}
            />
          </div>
          <div className="input-item">
            <label htmlFor="">Confirm password*</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password again..."
              name="repass"
              onChange={handleOnChange}
            />
          </div>
          <div className="forget">
            <p onClick={togglePasswordVisibility}>
              {showPassword ? "Hide password" : "Show password"}
            </p>
          </div>
          <button>Reset Password</button>
        </form>
      </div>
    </div>
  );
};
