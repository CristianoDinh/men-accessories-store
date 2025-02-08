import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import styles
import "../../../styles/components/private/account/account.css";
import { useDispatch } from "react-redux";
import {
  toggleAddAccountModal,
  toggleBlockAccountModal,
  toggleUnblockAccountModal,
} from "../../../redux/slices/modal/modal";
import { setAccountInfo } from "../../../redux/slices/account/account";
// import service
import * as AccountService from "../../../service/account/account";
import { ClipLoader } from "react-spinners";
export const AccountList = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [isEmptyList, setIsEmptyList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // query
  const {
    data: accountList = [],
    isError,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: AccountService.getAccountList,
  });
  //   handle func
  const filteredAccounts = accountList?.filter((account) =>
    account?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleToggleAddAccountModal = () => {
    dispatch(toggleAddAccountModal());
  };
  const handleToggleBlockAccountModal = (accountInfo) => {
    dispatch(setAccountInfo(accountInfo));
    dispatch(toggleBlockAccountModal());
  };
  const handleToggleUnblockAccountModal = (accountInfo) => {
    dispatch(setAccountInfo(accountInfo));
    dispatch(toggleUnblockAccountModal());
  };
  useEffect(() => {
    if (isLoading || isFetching) {
      setIsLoadingList(true);
    } else {
      setIsLoadingList(false);
    }
    if (isError) {
      setIsServerError(true);
    } else {
      setIsServerError(false);
    }
    if (filteredAccounts?.length === 0) {
      setIsEmptyList(true);
    } else {
      setIsEmptyList(false);
    }
  }, [isFetching, isLoading, isError, filteredAccounts]);
  return (
    <div className="account-list-container">
      <div className="utils">
        <div className="section-1">
          <div className="utils-header">
            <strong>Account list</strong>
            <p>total {accountList?.length} accounts</p>
          </div>
          <div className="buttons">
            <div className="add-btn" onClick={handleToggleAddAccountModal}>
              <i className="bx bx-plus"></i>
              <p>Add account</p>
            </div>
          </div>
        </div>
        <div className="section-2">
          <div className="filter">
            <div className="search">
              <i className="bx bx-search"></i>
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <table className="account-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Infomation</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoadingList ? (
            <>
              <div className="loading">
                <ClipLoader color="#000000" size={40} />
              </div>
            </>
          ) : isServerError ? (
            <>
              <div className="server-error">
                <p>Server is error now, please press F5 to reload again.</p>
              </div>
            </>
          ) : isEmptyList ? (
            <>
              <div className="empty-list">
                <p>Account you looking for is not found</p>
              </div>
            </>
          ) : (
            <>
              {filteredAccounts?.map((account, index) => (
                <tr key={account.userId}>
                  <td>{index + 1}</td>
                  <td>
                    {account.role === "ADMIN" ? (
                      <>
                        <i className="bx bx-crown"></i>
                      </>
                    ) : (
                      <>
                        <i className="bx bx-user"></i>
                      </>
                    )}
                    <div>
                      <strong>{account.fullName}</strong>
                      <p>{account.email}</p>
                    </div>
                  </td>
                  <td>{account.phone || "null"}</td>
                  <td>{account.address || "null"}</td>
                  {account.status ? (
                    <>
                      <td className="active-account">
                        <i className="bx bxs-circle"></i>
                        <p>Active</p>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="inactive-account">
                        <i className="bx bxs-circle"></i>
                        <p>Inactive</p>
                      </td>
                    </>
                  )}
                  {account.status ? (
                    <>
                      <td>
                        {account.role === "CUSTOMER" && (
                          <i
                            className="bx bx-block"
                            onClick={() =>
                              handleToggleBlockAccountModal(account)
                            }
                          ></i>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        {account.role === "CUSTOMER" && (
                          <i
                            className="bx bx-lock-open-alt"
                            onClick={() =>
                              handleToggleUnblockAccountModal(account)
                            }
                          ></i>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};
