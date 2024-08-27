import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useMyContext } from "../../store/ContextApi";
import Avatar from "@mui/material/Avatar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import Buttons from "../../utils/Buttons";
import Switch from "@mui/material/Switch";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Blocks } from "react-loader-spinner";
import moment from "moment";
import Errors from "../Errors";

const UserProfile = () => {
  // Access the currentUser and token hook using the useMyContext custom hook from the ContextProvider
  const { currentUser, token } = useMyContext();
  //set the loggin session from the token
  const [loginSession, setLoginSession] = useState(null);

  const [credentialExpireDate, setCredentialExpireDate] = useState(null);
  const [pageError, setPageError] = useState(false);

  const [accountExpired, setAccountExpired] = useState();
  const [accountLocked, setAccountLock] = useState();
  const [accountEnabled, setAccountEnabled] = useState();
  const [credentialExpired, setCredentialExpired] = useState();

  const [openAccount, setOpenAccount] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enable, Step 2: Verify

  //loading state
  const [loading, setLoading] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [disabledLoader, setDisbledLoader] = useState(false);
  const [twofaCodeLoader, settwofaCodeLoader] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      password: "",
    },
    mode: "onTouched",
  });

  //fetching the 2fa sttaus

  useEffect(() => {
    setPageLoader(true);

    const fetch2FAStatus = async () => {
      try {
        const response = await api.get(`/auth/user/2fa-status`);
        setIs2faEnabled(response.data.is2faEnabled);
      } catch (error) {
        setPageError(error?.response?.data?.message);
        toast.error("Error fetching 2FA status");
      } finally {
        setPageLoader(false);
      }
    };
    fetch2FAStatus();
  }, []);

  //enable the 2fa
  const enable2FA = async () => {
    setDisbledLoader(true);
    try {
      const response = await api.post(`/auth/enable-2fa`);
      setQrCodeUrl(response.data);
      setStep(2);
    } catch (error) {
      toast.error("Error enabling 2FA");
    } finally {
      setDisbledLoader(false);
    }
  };

  //diable the 2fa

  const disable2FA = async () => {
    setDisbledLoader(true);
    try {
      await api.post(`/auth/disable-2fa`);
      setIs2faEnabled(false);
      setQrCodeUrl("");
    } catch (error) {
      toast.error("Error disabling 2FA");
    } finally {
      setDisbledLoader(false);
    }
  };

  //verify the 2fa
  const verify2FA = async () => {
    if (!code || code.trim().length === 0)
      return toast.error("Please Enter The Code To Verify");

    settwofaCodeLoader(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);

      await api.post(`/auth/verify-2fa`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("2FA verified successful");

      setIs2faEnabled(true);
      setStep(1);
    } catch (error) {
      console.error("Error verifying 2FA", error);
      toast.error("Invalid 2FA Code");
    } finally {
      settwofaCodeLoader(false);
    }
  };

  //update the credentials
  const handleUpdateCredential = async (data) => {
    const newUsername = data.username;
    const newPassword = data.password;

    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newUsername", newUsername);
      formData.append("newPassword", newPassword);
      await api.post("/auth/update-credentials", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      toast.success("Update Credential successful");
    } catch (error) {
      toast.error("Update Credential failed");
    } finally {
      setLoading(false);
    }
  };

  //set the status of (credentialsNonExpired, accountNonLocked, enabled and credentialsNonExpired) current user
  useEffect(() => {
    if (currentUser?.id) {
      setValue("username", currentUser.username);
      setValue("email", currentUser.email);
      setAccountExpired(!currentUser.accountNonExpired);
      setAccountLock(!currentUser.accountNonLocked);
      setAccountEnabled(currentUser.enabled);
      setCredentialExpired(!currentUser.credentialsNonExpired);

      //moment npm package is used to format the date
      const expiredFormatDate = moment(
        currentUser?.credentialsExpiryDate
      ).format("D MMMM YYYY");
      setCredentialExpireDate(expiredFormatDate);
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);

      const lastLoginSession = moment
        .unix(decodedToken.iat)
        .format("dddd, D MMMM YYYY, h:mm A");
      //set the loggin session from the token
      setLoginSession(lastLoginSession);
    }
  }, [token]);

  //update the AccountExpiryStatus
  // const handleAccountExpiryStatus = async (event) => {
  //   setAccountExpired(event.target.checked);

  //   try {
  //     const formData = new URLSearchParams();
  //     formData.append("token", token);
  //     formData.append("expire", event.target.checked);

  //     await api.put("/auth/update-expiry-status", formData, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     //fetchUser();
  //     toast.success("Update Account Expirey Status");
  //   } catch (error) {
  //     toast.error("Update expirey status failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //update the AccountLockStatus
  // const handleAccountLockStatus = async (event) => {
  //   setAccountLock(event.target.checked);

  //   try {
  //     const formData = new URLSearchParams();
  //     formData.append("token", token);
  //     formData.append("lock", event.target.checked);

  //     await api.put("/auth/update-lock-status", formData, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     //fetchUser();
  //     toast.success("Update Account Lock Status");
  //   } catch (error) {
  //     toast.error("Update Account Lock status failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //update the AccountEnabledStatus
  // const handleAccountEnabledStatus = async (event) => {
  //   setAccountEnabled(event.target.checked);
  //   try {
  //     const formData = new URLSearchParams();
  //     formData.append("token", token);
  //     formData.append("enabled", event.target.checked);

  //     await api.put("/auth/update-enabled-status", formData, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     //fetchUser();
  //     toast.success("Update Account Enabled Status");
  //   } catch (error) {
  //     toast.error("Update Account Enabled status failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //update the CredentialExpiredStatus
  // const handleCredentialExpiredStatus = async (event) => {
  //   setCredentialExpired(event.target.checked);
  //   try {
  //     const formData = new URLSearchParams();
  //     formData.append("token", token);
  //     formData.append("expire", event.target.checked);

  //     await api.put("/auth/update-credentials-expiry-status", formData, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     //fetchUser();
  //     toast.success("Update Credentials Expiry Status");
  //   } catch (error) {
  //     toast.error("Credentials Expiry Status Failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (pageError) {
    return <Errors message={pageError} />;
  }

  //two function for opening and closing the according
  const onOpenAccountHandler = () => {
    setOpenAccount(!openAccount);
    setOpenSetting(false);
  };
  const onOpenSettingHandler = () => {
    setOpenSetting(!openSetting);
    setOpenAccount(false);
  };

  return (
    <div className="min-h-[calc(100vh-74px)] py-10 bg-slate-300">
      {pageLoader ? (
        <>
          {" "}
          <div className="flex  flex-col justify-center items-center  h-72">
            <span>
              <Blocks
                height="70"
                width="70"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
              />
            </span>
            <span>Please wait...</span>
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="w-full xl:w-[70%] lg:w-[80%] sm:w-[90%] mx-auto px-4 min-h-[500px] flex flex-col lg:flex-row gap-4">
  <div className="flex-1 flex flex-col bg-slate-200 shadow-gray-950-xl gap-4 px-6 py-8 rounded-2xl">
    <div className="flex flex-col items-center gap-2">
      <Avatar alt={currentUser?.username} src="/static/images/avatar/1.jpg" />
      <h3 className="text-2xl font-semibold">{currentUser?.username}</h3>
    </div>
    <div className="my-4 px-4 space-y-4">
      <h1 className="text-md font-semibold text-slate-800">
        UserName: <span className="font-normal text-slate-700">{currentUser?.username}</span>
      </h1>
      <h1 className="text-md font-semibold text-slate-800">
        Role: <span className="font-normal text-slate-700">{currentUser?.roles[0]}</span>
      </h1>
    </div>
    <div className="flex-1 flex flex-col rounded-3xl bg-slate-300 shadow-gray-950 gap-4 px-6 py-8">
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          Authentication (MFA)
          <span className={`px-2 py-1 mt-2 text-xs rounded-sm text-white ${is2faEnabled ? "bg-green-800" : "bg-customRed"}`}>
            {is2faEnabled ? "Activated" : "Deactivated"}
          </span>
        </h1>
        <h3 className="text-xl font-semibold text-slate-800">Multi Factor Authentication</h3>
        <p className="text-sm text-slate-800">
          Two Factor Authentication adds an additional layer of security to your account.
        </p>
      </div>
      <Buttons
        disabled={disabledLoader}
        onClickhandler={is2faEnabled ? disable2FA : enable2FA}
        className={`px-5 py-2 mt-2 text-white rounded-xl ${is2faEnabled ? "bg-customRed" : "bg-btnColor"}`}
      >
        {disabledLoader ? "Loading..." : is2faEnabled ? "Disable Two Factor Authentication" : "Enable Two Factor Authentication"}
      </Buttons>
      {step === 2 && (
        <div className="py-4">
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
              <h3 className="text-lg font-bold text-slate-700 uppercase">QR Code To Scan</h3>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <img src={qrCodeUrl} alt="QR Code" />
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="Enter 2FA code"
                    value={code}
                    required
                    className="px-2 py-1 mt-4 border rounded-md border-slate-800"
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button
                    className="px-3 h-10 mt-4 text-white rounded-md bg-btnColor"
                    onClick={verify2FA}
                  >
                    {twofaCodeLoader ? "Loading..." : "Verify 2FA"}
                  </button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  </div>
</div>

        </>
      )}
    </div>
  );
};

export default UserProfile;
