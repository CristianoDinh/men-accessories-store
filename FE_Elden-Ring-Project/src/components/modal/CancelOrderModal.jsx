import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
import { useDispatch } from "react-redux";
import { toggleCancelOrderModal } from "../../redux/slices/modal/modal";
// import service
import * as PaymentService from "../../service/payment/payment";
export const CancelOrderModal = () => {
  // selector
  const orderInfo = useSelector((state) => state.order.orderInfo.orderInfo);
  // dispatch
  const dispatch = useDispatch();
  //   state
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);

  //   mutation
  const mutation = useMutation({
    mutationKey: ["reject-order"],
    mutationFn: PaymentService.rejectOrder,
    onMutate: () => {
      setIsPreventSubmit(true);
    },
    onSuccess: () => {
      toast.success("Cancel order successful", {
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
    },
  });
  //   handle func
  const handleToggleCancelOrderModal = () => {
    dispatch(toggleCancelOrderModal());
  };
  const handleCancelOrder = async () => {
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
      await mutation.mutateAsync(orderInfo?.order?.orderId);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="cancel-order-modal-container">
      <ToastContainer />
      <div className="cancel-order-modal">
        <i className="bx bxs-error"></i>
        <strong>Cancel Order</strong>
        <p>You're are going to cancel your order. Are you sure?</p>
        <span>
          You have to cancel before admin approved your order. We will refund if
          you cancel this.
        </span>
        <div className="button">
          <button
            disabled={isPreventSubmit}
            onClick={handleToggleCancelOrderModal}
          >
            No, Don't cancel.
          </button>
          <button disabled={isPreventSubmit} onClick={handleCancelOrder}>
            Yes, Cancel!
          </button>
        </div>
      </div>
    </div>
  );
};
