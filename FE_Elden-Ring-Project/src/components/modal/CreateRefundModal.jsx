import { useRef, useState } from "react";
import FileResizer from "react-image-file-resizer";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
// import slices
import { toggleRefundRequestModal } from "../../redux/slices/modal/modal";
// import service
import * as RefundService from "../../service/refund/refund";
export const CreateRefundModal = () => {
  // ref
  const formRef = useRef(null);
  //   selector
  const orderInfo = useSelector((state) => state.order.orderInfo.orderInfo);
  // dispatch
  const dispatch = useDispatch();
  // state
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  const [submitData, setSubmitData] = useState({
    orderId: orderInfo?.order?.orderId,
    refundReason: "",
    refundReasonImage: "",
  });
  // mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["create-refund"],
    mutationFn: RefundService.createRefund,
    onMutate: () => {
      setIsPreventSubmit(true);
    },
    onSuccess: (response) => {
      if (response?.code === "ALREADY_REQUESTED_REFUND") {
        toast.error("You had requested this order before!!!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsPreventSubmit(false);
      } else {
        toast.success("Create request successful", {
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
        queryClient.invalidateQueries(["refunds"]);
      }
    },
  });
  // file
  const resizeFile = (file) => {
    FileResizer.imageFileResizer(
      file,
      300,
      300,
      "PNG",
      300,
      0,
      (uri) => {
        setPreviewImage(uri);
        setSubmitData({
          ...submitData,
          refundReasonImage: uri,
        });
      },
      "base64",
      250,
      250
    );
  };
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
      });
      return;
    }
    if (!submitData.refundReason || !submitData.refundReasonImage) {
      toast.error("Please input all fields", {
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
  const handleToggleRefundRequestModal = () => {
    dispatch(toggleRefundRequestModal());
  };
  const removeChooseImage = () => {
    setPreviewImage(null);
    setSubmitData({
      ...submitData,
      refundReasonImage: "",
    });
  };
  return (
    <div className="create-refund-modal-container">
      <ToastContainer />
      <div className="create-refund-modal">
        <div className="header">
          <div>
            <i className="bx bx-book-content"></i>
            <p>Create Refund</p>
          </div>
          <i className="bx bx-x" onClick={handleToggleRefundRequestModal}></i>
        </div>
        <form
          action=""
          onSubmit={handleOnSubmit}
          ref={formRef}
          autoComplete="new-password"
          className="create-refund-form"
        >
          <div className="input-image">
            <div>
              {previewImage ? (
                <>
                  <label htmlFor="image">
                    <img src={previewImage} alt="" />
                  </label>
                </>
              ) : (
                <>
                  <label htmlFor="image">
                    <i className="bx bx-image-add"></i>
                    <p>Click to choose image why you want to refund</p>
                  </label>
                </>
              )}
              <input
                type="file"
                name=""
                id="image"
                onChange={(e) => resizeFile(e.target.files[0])}
              />
            </div>
            <small onClick={removeChooseImage}>Clear the image</small>
          </div>
          <div className="input-content">
            <label htmlFor="">Reason*</label>
            <textarea
              name="refundReason"
              onChange={handleOnChange}
              id=""
              placeholder="Enter your reason..."
            ></textarea>
            <small>Please enter your reason here</small>
          </div>
        </form>
        <div className="submit">
          <button onClick={handleToggleRefundRequestModal}>Return</button>
          <button onClick={handleExternalSubmit}>Request Refund Now</button>
        </div>
      </div>
    </div>
  );
};
