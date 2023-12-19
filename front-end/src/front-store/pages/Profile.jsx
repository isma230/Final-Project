import React, { useEffect, useState } from "react";
import "../styles/profile.css"; // Import your profile-specific styles
import Header from "../components/Header/Header";

const Profile = () => {
  // State to store customer data
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    // Retrieve customer data from local storage
    const storedCustomer = localStorage.getItem("customer");

    if (storedCustomer) {
      // Parse the JSON string and set the customer data
      const parsedCustomer = JSON.parse(storedCustomer);
      setCustomerData(parsedCustomer);
    }
  }, []);

  return (
    <>
      <Header />
      <div className="profile-container">
        <h2 className="profile-heading">Profile</h2>
        {customerData ? (
          <div className="profile-info">
            <p>
              <strong>First Name:</strong> {customerData.firstname}
            </p>
            <p>
              <strong>Last Name:</strong> {customerData.lastname}
            </p>
            <p>
              <strong>Email:</strong> {customerData.email}
            </p>
            <p>
                <strong>Valid Account:</strong> {customerData.valid_account ? "Yes" : "No"}
            </p>
            <button>Delete Account</button>
          </div>
        ) : (
          <p className="no-data-message">
            No customer data found. Please log in.
          </p>
        )}
      </div>
    </>
  );
};

export default Profile;
