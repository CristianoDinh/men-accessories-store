import React from "react";
import { useSelector } from "react-redux";
// import styles
// import components
import "../../styles/private/blog/blog.css";
import { Dashnav } from "../../components/navbar/Dashnav";
import { BlogList } from "../../components/private/blog/BlogList";
import { PreviewBlog } from "../../components/modal/PreviewBlog";
import { AddBlogModal } from "../../components/modal/AddBlogModal";
import { UpdateBlogModal } from "../../components/modal/UpdateBlogModal";
import { DelBlogModal } from "../../components/modal/DelBlogModal";
export const BlogManager = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // selector
  const isToggleAddBlogModal = useSelector(
    (state) => state.modal.addBlogModal.isToggleModal
  );
  const isToggleUpdateBlogModal = useSelector(
    (state) => state.modal.updateBlogModal.isToggleModal
  );
  const isToggleDelBlogModal = useSelector(
    (state) => state.modal.delBlogModal.isToggleModal
  );
  return (
    <div className="blog-manager-container">
      {isToggleDelBlogModal && <DelBlogModal />}
      {isToggleUpdateBlogModal && <UpdateBlogModal />}
      {isToggleAddBlogModal && <AddBlogModal />}
      <PreviewBlog />
      <Dashnav />
      <div className="blog-manager">
        <div className="header">
          <p>Blog Manager</p>
          <div className="my-info">
            <i className="bx bx-user-circle"></i>
            <div>
              <strong>Hi, {user.fullName}</strong>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
        <BlogList />
      </div>
    </div>
  );
};
