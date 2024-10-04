import React from "react";
import PERMISSIONS from "../constants/Permissions";
import { useAuthContext } from "../contexts/authContext";

function WithPermission({ permission = "", children }) {
  const { user } = useAuthContext();
  const subrole = user.subrole;
  return <>{PERMISSIONS[permission]?.includes(subrole) ? children : null}</>;
}

export default WithPermission;
