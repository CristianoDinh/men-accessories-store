import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
// import styles
import "../../styles/components/modal/modal.css";
// import slices
import {
  togglePreviewBlogModalOff,
  toggleAnimateBlogModalOff,
  toggleDelBlogModal,
  toggleUpdateBlogModal,
} from "../../redux/slices/modal/modal";
// import service
import * as BlogService from "../../service/blog/blog";
import { ClipLoader } from "react-spinners";
export const PreviewBlog = () => {
  // selector
  const isTogglePreviewBlogModal = useSelector(
    (state) => state.modal.previewBlogModal.isToggleModal
  );
  const isToggleAnimateBlogModal = useSelector(
    (state) => state.modal.animateBlogModal.isToggleModal
  );
  const blogId = useSelector((state) => state.blog.blogId.blogId);
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [isServerError, setIsServerError] = useState(false);

  // query
  const {
    data: blogInfo = {},
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["blog-detail", blogId],
    queryFn: () => BlogService.getBlogDetail(blogId),
  });
  //   handle func
  const handleTogglePreviewBlogModalOff = () => {
    dispatch(toggleAnimateBlogModalOff());
    setTimeout(() => {
      dispatch(togglePreviewBlogModalOff());
    }, 800);
  };
  const handleToggleUpdateModal = () => {
    dispatch(toggleUpdateBlogModal());
  };
  const handleToggleDeleteModal = () => {
    dispatch(toggleDelBlogModal());
  };
  useEffect(() => {
    if (isLoading || isFetching) {
      setIsLoadingBlog(true);
    } else {
      setIsLoadingBlog(false);
    }
    if (isError) {
      setIsServerError(true);
    } else {
      setIsServerError(false);
    }
  }, [isError, isFetching, isLoading]);
  return (
    <div
      className={
        isTogglePreviewBlogModal
          ? `preview-blog-container`
          : `preview-blog-close`
      }
    >
      <div
        className={
          isToggleAnimateBlogModal
            ? `preview-blog-modal open`
            : `preview-blog-modal close`
        }
      >
        {isLoadingBlog ? (
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
        ) : (
          <>
            <div className="header">
              <strong>Blog Preview</strong>
              <i
                className="bx bx-x"
                onClick={handleTogglePreviewBlogModalOff}
              ></i>
            </div>
            <div className="preview">
              <div className="blog-header">
                <span>By {blogInfo?.fullname}</span>
                <strong>{blogInfo?.title}</strong>
                <p>
                  {" "}
                  {new Date(blogInfo.createDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <img src={blogInfo?.image} alt="" />
              <div className="main">
                <div className="content">
                  <p>{blogInfo.content}</p>
                </div>
              </div>
            </div>
            <div className="buttons">
              <button onClick={handleToggleUpdateModal}>
                <i className="bx bx-edit-alt"></i>
                <p>Update blog</p>
              </button>
              <button onClick={handleToggleDeleteModal}>
                <i className="bx bx-trash-alt"></i>
                <p>Delete blog</p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
