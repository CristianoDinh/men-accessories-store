import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import styles
import "../../styles/public/paymentcancel/paymentcancel.css";
export const PaymentCancel = () => {
  const paymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));
  // navigate
  const navigate = useNavigate();
  // handle func
  const handleReturn = () => {
    localStorage.removeItem("paymentInfo");
  };
  useEffect(() => {
    if (!paymentInfo) {
      navigate("/");
    }
  }, []);
  return (
    <div className="payment-cancel-container">
      <div className="payment-cancel">
        <i className="bx bxs-x-circle"></i>
        <strong>Payment Canceled!</strong>
        <p>
          You have canceled the payment process. If you have any doubts about
          the product quality, please send us an email or go to our fanpage to
          see feedbacks.
        </p>
        <Link to="/" onClick={handleReturn}>
          Return to homepage
        </Link>
      </div>
    </div>
  );
};
