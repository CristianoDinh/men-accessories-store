import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/public/profile/profile.css";
// import components
import { SettingNav } from "../../components/navbar/SettingNav";
import { BounceLoader } from "react-spinners";
// import service
import * as AccountService from "../../service/account/account";
export const ProfileSettingPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // state
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [submitData, setSubmitData] = useState({
    fullName: "",
    phone: "",
    address: "",
    status: true,
  });
  // mutation
  const mutation = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: AccountService.updateMyInfo,
    onMutate: () => {
      setIsPreventSubmit(true);
      setIsLoadingPage(true);
    },
    onSuccess: () => {
      toast.success("Updated your infomation", {
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
        setIsPreventSubmit(false);
        setIsLoadingPage(false);
      }, 1000);
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
      toast.error("On process, please wait for 1 second!", {
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
    if (
      submitData.fullName === "" ||
      submitData.address === "" ||
      submitData.phone === ""
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
    if (
      submitData.phone.length < 8 ||
      submitData.phone.length > 11 ||
      !/^0\d+$/.test(submitData.phone)
    ) {
      toast.error("Please input valid phone number", {
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
    if (submitData.address.trim() === "") {
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
  useEffect(() => {
    if (user) {
      setSubmitData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, []);
  return (
    <div className="profile-setting-container">
      <ToastContainer />
      <SettingNav />
      <div className="profile-setting">
        <div className="header">
          <strong>Personal Infomation</strong>
          {isLoadingPage ? (
            <>
              <div className="loading">
                <BounceLoader color="#23B870" size={25} />
                <p>Saving changes</p>
              </div>
            </>
          ) : (
            <>
              <div className="saved">
                <i className="bx bx-check"></i>
                <p>Lastest updated</p>
              </div>
            </>
          )}
        </div>
        <form action="" onSubmit={handleOnSubmit} className="info-form">
          <div className="input-item">
            <label htmlFor="">Email</label>
            <input
              type="text"
              defaultValue={user?.email}
              disabled
              placeholder=""
            />
            <small>You cannot change email address</small>
          </div>
          <div className="input-item">
            <label htmlFor="">Name</label>
            <input
              type="text"
              name="fullName"
              onChange={handleOnChange}
              defaultValue={submitData.fullName}
              placeholder="Enter your name"
            />
            <small>You can change your name</small>
          </div>
          <div className="input-item">
            <label htmlFor="">Phone</label>
            <input
              type="text"
              name="phone"
              onChange={handleOnChange}
              defaultValue={submitData.phone || ""}
              placeholder="Enter your phone number"
            />
            <small>You can change phone number</small>
          </div>
          <div className="input-item">
            <label htmlFor="">Address</label>
            <input
              type="text"
              name="address"
              onChange={handleOnChange}
              defaultValue={submitData.address || ""}
              placeholder="Enter your address"
            />
            <small>You can change your address(for shipping)</small>
          </div>
          <button>Change Infomation</button>
        </form>
      </div>
    </div>
  );
};
