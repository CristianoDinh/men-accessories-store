import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
// import slices
import { toggleAddAccountModal } from "../../redux/slices/modal/modal";
// import service
import * as AccountService from "../../service/account/account";
export const AddAccountModal = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // ref
  const formRef = useRef(null);
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  const [submitData, setSubmitData] = useState({
    email: "",
    fullName: "",
    password: "",
  });
  // mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["add-admin-account"],
    mutationFn: AccountService.createUserAdmin,
    onMutate: () => {
      setIsPreventSubmit(true);
    },
    onSuccess: (response) => {
      if (response && response.code === "EMAIL_EXISTED") {
        toast.error("Email existed, try another one", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          setIsPreventSubmit(false);
        }, 1500);
      } else {
        toast.success("Add account successful", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          setIsPreventSubmit(false);
          location.reload();
        }, 1500);
        queryClient.invalidateQueries(["accounts"]);
      }
    },
  });
  //   handle func
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
        position: "top-right",
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
    if (!submitData.email || !submitData.fullName || !submitData.password) {
      toast.error("Please input all fields", {
        position: "top-right",
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
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (submitData.password.length < 8 || /\s/.test(submitData.password)) {
      toast.error(
        "Password must be at least 8 characters long and must not contain spaces",
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
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
  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };
  const handleToggleAddAccountModal = () => {
    dispatch(toggleAddAccountModal());
  };
  return (
    <div className="add-account-modal-container">
      <ToastContainer />
      <div className="add-account-modal">
        <div className="header">
          <div>
            <i className="bx bxs-user-circle"></i>
            <p>Add Account (for Manager)</p>
          </div>
          <i className="bx bx-x" onClick={handleToggleAddAccountModal}></i>
        </div>
        <form
          action=""
          autoComplete="new-password"
          onSubmit={handleOnSubmit}
          ref={formRef}
          className="add-account-form"
        >
          <div className="input-item">
            <label htmlFor="">Full name*</label>
            <input
              type="text"
              name="fullName"
              onChange={handleOnChange}
              placeholder="Enter full name..."
            />
            <small>Enter fullname of user</small>
          </div>
          <div className="input-item">
            <label htmlFor="">Email*</label>
            <input
              type="text"
              name="email"
              onChange={handleOnChange}
              placeholder="Enter email..."
            />
            <small>Email should be: example@gmail.com</small>
          </div>
          <div className="input-item">
            <label htmlFor="">Password*</label>
            <input
              type="text"
              onChange={handleOnChange}
              name="password"
              placeholder="Enter password..."
            />
            <small>Password must at least 8 characters</small>
          </div>
        </form>
        <div className="submit">
          <button onClick={handleToggleAddAccountModal}>Return</button>
          <button onClick={handleExternalSubmit}>Confirm create account</button>
        </div>
      </div>
    </div>
  );
};
