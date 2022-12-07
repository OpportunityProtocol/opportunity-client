import router from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { ZERO_ADDRESS } from "../../../constant";
import {
  selectUserAccountData,
  selectLens,
  selectUser,
} from "../../../modules/user/userReduxSlice";

const AuthRedirect = () => {
  const userData = useSelector(selectUser);
  const lensProfile = useSelector(selectLens);
  const accountData = useAccount();

  useEffect(() => {
    console.log(userData)
    console.log(lensProfile)
    console.log(accountData)
    if (
      String(userData.address).toLowerCase() === ZERO_ADDRESS.toLowerCase() ||
      lensProfile.profileId === 0 ||
      accountData.status !== "connected"
    ) {
      router.push("/");
    }
  }, [userData.address, lensProfile.profileId, accountData.status]);

  return null;
};

export default AuthRedirect;
