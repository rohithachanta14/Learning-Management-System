import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import apiInstance from "../../utils/axios";
import CartId from "../plugin/CartId";
import Toast from "../plugin/Toast";
import { userId } from "../../utils/constants";

function Checkout() {
  const [order, setOrder] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const param = useParams();
  const fetchOrder = async () => {
    try {
      apiInstance.get(`order/checkout/${param.order_oid}/`).then((res) => {
        setOrder(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const applyCoupon = async () => {
    const formdata = new FormData();
    formdata.append("order_oid", order?.oid);
    formdata.append("coupon_code", coupon);

    try {
      await apiInstance.post(`order/coupon/`, formdata).then((res) => {
        console.log(res.data);
        fetchOrder();
        Toast().fire({
          icon: res.data.icon,
          title: res.data.message,
        });
      });
    } catch (error) {
      if (error.response.data.includes("Coupon matching query does not exi")) {
        Toast().fire({
          icon: "error",
          title: "Coupon does not exist",
        });
      }
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);


  const pay = async (event) => {
    event.preventDefault();
    setPaymentLoading(true);
    const formdata = new FormData();
    formdata.append("order_oid", order?.oid);
    
    try {
      const response = await apiInstance.post('payment/payment-success/', formdata);
      if (response.status === 200) {
        // Navigate to Success page with order_oid parameter
        navigate(`/payment-success/${order?.oid}/`);
      } else {
        console.error('Payment update failed:', response.data.message);
        Toast().fire({
          icon: "error",
          title: response.data.message || "Payment failed. Please try again.",
        });
      }
    } catch (error) {
      console.error('Error during payment process:', error);
      Toast().fire({
        icon: "error",
        title: "Payment failed. Please try again.",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <>
      <BaseHeader />
      <section className="py-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bg-light p-4 text-center rounded-3">
                <h1 className="m-0">Checkout</h1>
                <div className="d-flex justify-content-center">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-dots mb-0">
                      <li className="breadcrumb-item">
                        <a href="#" className="text-decoration-none text-dark">
                          Home
                        </a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="#" className="text-decoration-none text-dark">
                          Courses
                        </a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="#" className="text-decoration-none text-dark">
                          Cart
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Checkout
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-5">
        <div className="container">
          <div className="row g-4 g-sm-5">
            <div className="col-xl-8 mb-4 mb-sm-0">
              <div
                className="alert alert-warning alert-dismissible d-flex justify-content-between align-items-center fade show py-2 pe-2"
                role="alert"
              >
                <div>
                  <i className="bi bi-exclamation-octagon-fill me-2" />
                  Review your courses before payment
                </div>
                <button
                  type="button"
                  className="btn btn-warning mb-0 text-primary-hover text-end"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                >
                  <i className="bi bi-x-lg text-white" />
                </button>
              </div>
              <div className="p-4 shadow rounded-3 mt-4">
                <h5 className="mb-0 mb-3">Courses</h5>
                <div className="table-responsive border-0 rounded-3">
                  <table className="table align-middle p-4 mb-0">
                    <tbody className="border-top-2">
                      {order?.order_items?.map((o, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-lg-flex align-items-center">
                              <div className="w-100px w-md-80px mb-2 mb-md-0">
                                <img
                                  src={o.course.image}
                                  style={{
                                    width: "100px",
                                    height: "70px",
                                    objectFit: "cover",
                                  }}
                                  className="rounded"
                                  alt=""
                                />
                              </div>
                              <h6 className="mb-0 ms-lg-3 mt-2 mt-lg-0">
                                <a
                                  href="#"
                                  className="text-decoration-none text-dark"
                                >
                                  {o.course.title}
                                </a>
                              </h6>
                            </div>
                          </td>
                          <td className="text-center">
                            <h5 className="text-success mb-0">${o.price}</h5>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link to={`/cart/`} className="btn btn-outline-secondary mt-3">
                  Edit Cart <i className="fas fa-edit"></i>
                </Link>
              </div>
              <div className="shadow p-4 rounded-3 mt-5">
                <h5 className="mb-0">Personal Details</h5>
                <form className="row g-3 mt-0">
                  <div className="col-md-12 bg-light-input">
                    <label htmlFor="yourName" className="form-label">
                      Your name *
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      id="yourName"
                      placeholder="Name"
                      readOnly
                      value={order.full_name}
                    />
                  </div>
                  <div className="col-md-12 bg-light-input">
                    <label htmlFor="emailInput" className="form-label">
                      Email address *
                    </label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      id="emailInput"
                      placeholder="Email"
                      readOnly
                      value={order.email}
                    />
                  </div>
                  <div className="col-md-12 bg-light-input">
                    <label htmlFor="mobileNumber" className="form-label">
                      Select country *
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      id="mobileNumber"
                      placeholder="Country"
                      readOnly
                      value={order.country}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card card-body shadow p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Summary</h5>
                </div>
                <ul className="list-group list-group-borderless mt-3 mb-2">
                  <li className="list-group-item">
                    <span>Total:</span>
                    <span className="h6 mb-0 ms-2">${order?.total}</span>
                  </li>
                </ul>
                <h6 className="mb-0">Add a coupon code</h6>
                <div className="input-group mt-2">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button
                    className="btn btn-primary mb-0"
                    type="button"
                    onClick={applyCoupon}
                  >
                    Apply
                  </button>
                </div>
                <p className="mb-0 mt-2">
                  <i className="bi bi-info-circle me-2" />
                  Your coupon will be applied on the payment page.
                </p>
              </div>
              <div className="col-12 d-sm-flex align-items-center mt-4">
                <p className="mb-0">We accept:</p>
                <ul className="list-inline mb-0 ms-2">
                  <li className="list-inline-item">
                    <a className="h6 mb-0" href="#">
                      <i className="fab fa-cc-visa text-primary" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="h6 mb-0" href="#">
                      <i className="fab fa-cc-mastercard text-danger" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="h6 mb-0" href="#">
                      <i className="fab fa-cc-paypal text-info" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="shadow p-4 rounded-3 mt-5">
                <h5 className="mb-3">Payment Method</h5>
                <form className="w-100">
                  {paymentLoading ? (
                    <button
                      type="button"
                      disabled
                      className="btn btn-lg btn-success mt-2 w-100"
                    >
                      Processing <i className="fas fa-spinner fa-spin"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={pay}
                      className="btn btn-lg btn-success mt-2 w-100"
                    >
                      Pay
                    </button>
                  )}
                </form>
                <div className="form-check mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="flexCheckChecked"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckChecked"
                  >
                    By Continuing, you agree to our{" "}
                    <a href="#">Terms of service</a>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BaseFooter />
    </>
  );
}

export default Checkout;
