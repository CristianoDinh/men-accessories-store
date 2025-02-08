import React from "react";
import { useSelector } from "react-redux";
// import styles
import "../../styles/private/account/account.css";
// import components
import { Dashnav } from "../../components/navbar/Dashnav";
import { AccountList } from "../../components/private/account/AccountList";
import { AddAccountModal } from "../../components/modal/AddAccountModal";
import { BlockAccountModal } from "../../components/modal/BlockAccountModal";
import { UnblockAccountModal } from "../../components/modal/UnblockAccountModal";
export const AccountManager = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // selector
  const isToggleAddAccountModal = useSelector(
    (state) => state.modal.addAccountModal.isToggleModal
  );
  const isToggleBlockAccountModal = useSelector(
    (state) => state.modal.blockAccountModal.isToggleModal
  );
  const isToggleUnblockAccountModal = useSelector(
    (state) => state.modal.unblockAccountModal.isToggleModal
  );
  return (
    <div className="account-manager-container">
      {isToggleUnblockAccountModal && <UnblockAccountModal />}
      {isToggleAddAccountModal && <AddAccountModal />}
      {isToggleBlockAccountModal && <BlockAccountModal />}
      <Dashnav />
      <div className="account-manager">
        <div className="header">
          <p>Account Manager</p>
          <div className="my-info">
            <i className="bx bx-user-circle"></i>
            <div>
              <strong>Hi, {user.fullName}</strong>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
        <AccountList />
      </div>
    </div>
  );
};
