import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { SyncLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/auth/verify/verify.css";
// import slices
import { setEmail, setOtp } from "../../redux/slices/account/account";
// import redux
import { useSelector, useDispatch } from "react-redux";
// import service
import * as AccountService from "../../service/account/account";
export const VerifyPage = () => {
  // selector
  const email = useSelector((state) => state.account.email.email);
  // navigate
  const navigate = useNavigate();
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [submitOtp, setSubmitOtp] = useState(Array(6).fill(""));
  const [submitData, setSubmitData] = useState({
    email: email,
    otp: "",
  });
  // mutation
  const mutation = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: AccountService.verifyEmailForget,
    onMutate: () => {
      setIsLoadingPage(true);
    },
    onSuccess: (response) => {
      if (response?.code === "EMAIL_OTP_INVALID") {
        toast.error("Wrong OTP code, please try again!", {
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
        setIsLoadingPage(false);
        dispatch(setEmail(submitData.email));
        dispatch(setOtp(submitData.otp));
        navigate("/reset-password");
      }
    },
  });
  // handle func
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...submitOtp];
    newOtp[index] = element.value;
    setSubmitOtp(newOtp);
    setSubmitData({
      ...submitData,
      otp: newOtp.join(""),
    });
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !submitOtp[index] &&
      e.target.previousSibling
    ) {
      e.target.previousSibling.focus();
    }
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!submitData.otp) {
      toast.error("Please enter OTP", {
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
  useEffect(() => {
    if (!email) {
      navigate("/forget");
    }
  }, []);
  return (
    <div className="email-verify-container">
      {isLoadingPage && (
        <div className="loading">
          <SyncLoader margin={5} size={20} color="#ffffff" />
        </div>
      )}
      <ToastContainer />
      <div className="email-verify">
        <div className="email-verify-header">
          <h2>Email Verification</h2>
          <p>We have sent OTP code to your email.</p>
        </div>
        <form onSubmit={handleOnSubmit}>
          <div className="otp-inputs">
            {submitOtp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={submitOtp[index]}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-input"
              />
            ))}
          </div>
          <button type="submit" className="submit-btn">
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};
