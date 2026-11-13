import React, { useState } from "react";
import axios from "axios"; // Add this import statement
import "./styles/App.css"; // You'll need to create this CSS file
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import showPopup from "../helpers/pop_up_notification";
// import handleRequest from './../common_helpers/handel_http_axios_request';

const App = () => {
  const navigate = useNavigate();

  function navigateToHome() {
    navigate("submit");
  }

  function navigateWelcomeScreen() {
    navigate("home");
  }
  function navigateFrontPage() {
    navigate("/");
  }

  const [showPassword, setShowPassword] = useState(false);

  // const togglePasswordVisibility = () => {
  //   setShowPassword(prevState => !prevState);
  // };

  // handleRequest(baseUrl, endpoint, method, requestBody);

  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      console.log("Attempting to login:", formData);
      const response = await axios.post(
        "http://localhost:4900/api/v1/customer/login",
        formData
      );

      console.log("Response from server:", response);
      if (response.status === 400) {
        // Display bad request error message from backend
        console.error("Bad Request Error:", response.data);
        console.log("Error Message:", response.data.message);
        showPopup(response.data.message, "red");
      }

      if (response.status === 200) {
        // Display success message
        showPopup(response.data.message, "green");
        navigateWelcomeScreen();
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // Display error message
      showPopup("Login attemp Failed", "red");
    }
  };

  return (
    <div className="container-fluid main-wrapper">
      <div className="content">
        {/* <div className="logo"> Balance Humanity
        
        </div> */}

        <svg viewBox="0 0 395.52 247.2" height="140.2" width="200.52">
          <g>
            <svg></svg>
          </g>
          <g>
            <svg
              viewBox="0 0 395.52 247.2"
              href={navigateFrontPage}
              height="247.2"
              width="395.52"
            >
              <g transform="matrix(1,0,0,1,75.54432,53.43200706624606)">
                <svg
                  viewBox="0 0 244.43135999999998 140.33598586750787"
                  height="140.33598586750787"
                  width="244.43135999999998"
                >
                  <g>
                    <svg
                      viewBox="0 0 244.43135999999998 140.33598586750787"
                      height="140.33598586750787"
                      width="244.43135999999998"
                    >
                      <g>
                        <svg
                          viewBox="0 0 244.43135999999998 140.33598586750787"
                          height="140.33598586750787"
                          width="244.43135999999998"
                        >
                          <g>
                            <svg
                              viewBox="0 0 244.43135999999998 140.33598586750787"
                              height="140.33598586750787"
                              width="244.43135999999998"
                            >
                              <g id="textblocktransform">
                                <svg
                                  viewBox="0 0 244.43135999999998 140.33598586750787"
                                  height="140.33598586750787"
                                  width="244.43135999999998"
                                  id="textblock"
                                >
                                  <g>
                                    <svg
                                      viewBox="0 0 244.43135999999998 140.33598586750787"
                                      height="140.33598586750787"
                                      width="244.43135999999998"
                                    >
                                      <g transform="matrix(1,0,0,1,0,0)">
                                        <svg
                                          width="244.43135999999998"
                                          viewBox="4.309999942779541 -31.3799991607666 54.64999771118164 31.3799991607666"
                                          height="140.33598586750787"
                                          data-palette-color="#000000"
                                        >
                                          <path
                                            d="M4.31-1.9L4.31-29.48Q4.31-30.17 4.71-30.57L4.71-30.57Q5.4-31.26 6.21-31.38L6.21-31.38 16.32-31.38Q20.52-31.38 23.22-29.14L23.22-29.14Q25.86-27.01 25.86-23.45L25.86-23.45Q25.86-20.86 24.25-18.97L24.25-18.97Q22.53-17.01 19.83-16.38L19.83-16.38 19.83-16.32Q25-15.4 26.67-11.38L26.67-11.38Q27.13-10.11 27.13-8.51 27.13-6.9 26.61-5.34 26.09-3.79 24.83-2.64L24.83-2.64Q21.95 0 16.72 0L16.72 0 6.21 0Q5.52 0 5-0.46L5-0.46Q4.31-1.03 4.31-1.9L4.31-1.9ZM8.1-14.71L8.1-2.99 14.71-2.99Q19.08-2.99 20.86-4.25L20.86-4.25Q23.1-5.63 23.1-8.85L23.1-8.85Q23.1-13.91 17.13-14.6L17.13-14.6Q15.34-14.71 13.1-14.71L13.1-14.71 8.1-14.71ZM21.9-23.1L21.9-23.1Q21.9-28.39 14.6-28.28L14.6-28.28 8.1-28.28 8.1-17.59 14.66-17.59Q19.48-17.59 21.26-20.52L21.26-20.52Q21.9-21.55 21.9-23.1ZM55-17.93L55-29.48Q55-30.8 56.32-31.21L56.32-31.21Q56.66-31.26 57.18-31.32 57.7-31.38 58.33-30.92 58.96-30.46 58.96-29.48L58.96-29.48 58.96-1.9Q58.96-1.03 58.45-0.57L58.45-0.57Q57.76 0 56.98 0 56.2 0 55.6-0.46 55-0.92 55-1.9L55-1.9 55-14.66 38.5-14.66 38.5-1.9Q38.5-1.03 38.04-0.57L38.04-0.57Q37.35 0 36.55 0 35.74 0 35.17-0.46 34.6-0.92 34.6-1.9L34.6-1.9 34.6-29.48Q34.6-30.8 35.86-31.21L35.86-31.21Q36.2-31.26 36.72-31.32 37.24-31.38 37.87-30.92 38.5-30.46 38.5-29.48L38.5-29.48 38.5-17.93 55-17.93Z"
                                            opacity="1"
                                            transform="matrix(1,0,0,1,0,0)"
                                            fill="#000000"
                                            class="wordmark-text-0"
                                            data-fill-palette-color="primary"
                                            id="text-0"
                                          ></path>
                                        </svg>
                                      </g>
                                    </svg>
                                  </g>
                                </svg>
                              </g>
                            </svg>
                          </g>
                        </svg>
                      </g>
                    </svg>
                  </g>
                </svg>
              </g>
              <g>
                <path
                  d="M245.816 0c68.262 0 123.6 55.338 123.6 123.6 0 68.262-55.338 123.6-123.6 123.6-34.468 0-65.641-14.109-88.059-36.867l9.126 0c20.835 18.972 48.533 30.539 78.933 30.539 64.768 0 117.272-52.505 117.272-117.272 0-64.768-52.505-117.272-117.272-117.272-30.399 0-58.097 11.567-78.933 30.539l-9.126 0c22.417-22.758 53.59-36.867 88.059-36.867z"
                  fill="#000000"
                  stroke="transparent"
                  data-fill-palette-color="tertiary"
                ></path>
              </g>
            </svg>
          </g>
          <defs></defs>
        </svg>
        <div className="image"></div>

        <div className="text">
          Start for free & get regret
          <br />
        </div>
      </div>

      <form id="form">
        <div className="title">Login</div>

        {/* User Name input */}
        <div className="">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <i className="far fa-envelope"></i>
          <FaUser size={20} className="userIconClass"></FaUser>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
        </div>

        {/* Email input */}
        {/* <div>
          <label htmlFor="email">Email</label>
          <i className="far fa-envelope"></i>

          <input type="email" name="email" id="email" placeholder="abishek@yopmail.com" />

          <i className="fas fa-exclamation-circle failure-icon"></i>
          <i className="far fa-check-circle success-icon"></i>

          <div className="error"></div>
        </div> */}

        {/* Password input */}
        <div>
          <label htmlFor="password">Password</label>

          <FaLock className="userIconClass" size={20} />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password here"
            value={formData.password}
            onChange={handleChange}
          />

          <i className="fas fa-exclamation-circle failure-icon"></i>
          <i className="far fa-check-circle success-icon"></i>

          <div className="error"></div>
        </div>

        <button type="button" onClick={handleLogin} id="btn">
          Submit
        </button>

        <button onClick={navigateToHome}> Sign Up</button>
      </form>
    </div>
  );
};

export default App;
