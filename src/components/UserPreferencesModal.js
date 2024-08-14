import React from "react";
import { userOnboardedAtom } from "@/app/jotai/user/atoms";
import { useAtom } from "jotai";
import UserInformationForm from "./UserPreferences";


const UserPreferencesModal = () => {
    const [userOnboarded, setUserOnboarded] = useAtom(userOnboardedAtom);

  return (
    <div
      className={`${userOnboarded && "hidden"} fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}
    //   onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full overflow-y-auto h-[700px] max-w-5xl">
       <UserInformationForm />
      </div>
    </div>
  );
};

export default UserPreferencesModal;
