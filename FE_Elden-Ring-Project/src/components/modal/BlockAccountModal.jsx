import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleBlockAccountModal } from "../../redux/slices/modal/modal";
// import service
import * as AccountService from "../../service/account/account";
export const BlockAccountModal = () => {
  // selector
  const accountInfo = useSelector(
    (state) => state.account.accountInfo.accountInfo
  );
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  // mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["block-account"],
    mutationFn: AccountService.blockAccount,
    onMutate: () => {
      setIsPreventSubmit(true);
    },
    onSuccess: () => {
      toast.success("Block account successful", {
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
      setTimeout(() => {
        setIsPreventSubmit(false);
        location.reload();
      }, 1500);
      queryClient.invalidateQueries(["accounts"]);
    },
  });
  //   handle func
  const handleToggleBlockAccountModal = () => {
    dispatch(toggleBlockAccountModal());
  };
  const handleBlockAccount = async () => {
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
    try {
      await mutation.mutateAsync(accountInfo?.userId);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="block-account-modal-container">
      <ToastContainer />
      <div className="block-account-modal">
        <i className="bx bxs-error"></i>
        <strong>Block Account</strong>
        <p>You're going to block user {accountInfo?.fullName}. Are you sure?</p>
        <div className="button">
          <button onClick={handleToggleBlockAccountModal}>
            No, Don't block.
          </button>
          <button onClick={handleBlockAccount}>Yes, Block!</button>
        </div>
      </div>
    </div>
  );
};
