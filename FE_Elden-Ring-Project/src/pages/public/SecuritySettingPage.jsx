import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/public/security/security.css";
// import components
import { SettingNav } from "../../components/navbar/SettingNav";
import { BounceLoader } from "react-spinners";
// import service
import * as AccountService from "../../service/account/account";
export const SecuritySettingPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isOauth = user?.googleAccount;
  // state
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitData, setSubmitData] = useState({
    oldPassword: "",
    newPassword: "",
    repass: "",
  });
  // mutation
  const mutation = useMutation({
    mutationKey: ["update-password"],
    mutationFn: AccountService.updateMyPassword,
    onMutate: () => {
      setIsPreventSubmit(true);
      setIsLoadingPage(true);
    },
    onSuccess: (response) => {
      if (response?.code === "WRONG_PASSWORD") {
        toast.error("Wrong your current password, please try again!", {
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
      } else {
        toast.success("Updated your password", {
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
          location.reload();
          setIsPreventSubmit(false);
          setIsLoadingPage(false);
        }, 1000);
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
      submitData.oldPassword === "" ||
      submitData.oldPassword === "" ||
      submitData.repass === ""
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
    if (submitData.newPassword.length < 8 || /\s/.test(submitData.password)) {
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
    if (submitData.newPassword !== submitData.repass) {
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
    try {
      await mutation.mutateAsync(submitData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {}, []);
  return (
    <div className="security-setting-container">
      <ToastContainer />
      <SettingNav />
      {isOauth ? (
        <>
          <strong className="is-oauth">
            Sorry, your account logged by Google so you don't have to change
            your password
          </strong>
        </>
      ) : (
        <>
          <div className="security-setting">
            <div className="header">
              <strong>Security Setting</strong>
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
            <form action="" onSubmit={handleOnSubmit} className="security-form">
              <div className="input-item">
                <label htmlFor="">Current password</label>
                <input
                  type="text"
                  name="oldPassword"
                  onChange={handleOnChange}
                  placeholder="*********"
                />
                <small>
                  You have to enter the current password before change password
                </small>
              </div>
              <div className="input-item">
                <label htmlFor="">New password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  onChange={handleOnChange}
                  placeholder="Enter new password"
                />
                <small>Enter new password to change password</small>
              </div>
              <div className="input-item">
                <label htmlFor="">Confirm new password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="repass"
                  onChange={handleOnChange}
                  placeholder="Confirm password again"
                />

                <small>Confirm new password again to complete changes</small>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  textDecoration: "underline",
                  cursor: "pointer",
                  width: "fit-content",
                }}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide password" : "Show password"}
              </p>
              <button>Change password</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
