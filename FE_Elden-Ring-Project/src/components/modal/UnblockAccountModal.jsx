import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleUnblockAccountModal } from "../../redux/slices/modal/modal";
// import service
import * as AccountService from "../../service/account/account";
export const UnblockAccountModal = () => {
  // selector
  const accountInfo = useSelector(
    (state) => state.account.accountInfo.accountInfo
  );
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  const [submitData, setSubmitData] = useState({
    status: true,
  });
  // mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["unblock-account"],
    mutationFn: (updateData) => {
      AccountService.unblockAccount(accountInfo?.userId, updateData);
    },
    onMutate: () => {
      setIsPreventSubmit(true);
    },
    onSuccess: () => {
      toast.success("Unblock account successful", {
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
  const handleToggleUnblockAccountModal = () => {
    dispatch(toggleUnblockAccountModal());
  };
  const handleUnblockAccount = async () => {
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
      await mutation.mutateAsync(submitData);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="block-account-modal-container">
      <ToastContainer />
      <div className="block-account-modal">
        <i className="bx bxs-error"></i>
        <strong>Unblock Account</strong>
        <p>
          You're going to unblock user {accountInfo?.fullName}. Are you sure?
        </p>
        <div className="button">
          <button onClick={handleToggleUnblockAccountModal}>
            No, Stay it.
          </button>
          <button onClick={handleUnblockAccount}>Yes, Unblock!</button>
        </div>
      </div>
    </div>
  );
};
