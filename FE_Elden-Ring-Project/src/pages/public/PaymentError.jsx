import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import styles
import "../../styles/public/paymentcancel/paymentcancel.css";
export const PaymentError = () => {
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
        <i className="bx bx-error"></i>
        <strong>Payment Error!</strong>
        <p>
          The payment process has been canceled because the system is having
          problems. Please check your Paypal account. If money has been
          deducted, please contact us for resolution as soon as possible.
        </p>
        <Link to="/" onClick={handleReturn}>
          Return to homepage
        </Link>
      </div>
    </div>
  );
};
