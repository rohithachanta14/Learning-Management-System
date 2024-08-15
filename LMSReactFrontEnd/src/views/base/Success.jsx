import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BaseHeader from '../partials/BaseHeader';
import BaseFooter from '../partials/BaseFooter';
import apiInstance from '../../utils/axios';

function Success() {
  const { order_oid } = useParams();
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        // Fetch payment status from the backend
        const res = await apiInstance.get(`payment/payment-status/${order_oid}/`);
        setPaymentStatus(res.data.message);
      } catch (error) {
        console.error('Error fetching payment status:', error);
        setPaymentStatus('Payment failed. Please try again.');
      }
    };

    fetchPaymentStatus();
  }, [order_oid]);

  return (
    <>
      <BaseHeader />
      <section className="py-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bg-light p-4 text-center rounded-3">
                <h1 className="m-0">Payment Status</h1>
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
                          Checkout
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Payment Status
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
            <div className="col-12 text-center">
              <div className="shadow p-4 rounded-3 mt-5">
                <h5 className="mb-3">{paymentStatus}</h5>
                {paymentStatus === 'Payment Successful' && (
                  <p>Thank you for your purchase! Your order has been successfully processed.</p>
                )}
                {paymentStatus === 'Payment failed. Please try again.' && (
                  <p>Unfortunately, your payment could not be processed. Please try again or contact support.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <BaseFooter />
    </>
  );
}

export default Success;
