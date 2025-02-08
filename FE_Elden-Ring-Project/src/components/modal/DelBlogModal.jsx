import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
// import slices
import { toggleDelBlogModal } from "../../redux/slices/modal/modal";
// import service
import * as BlogService from "../../service/blog/blog";
export const DelBlogModal = () => {
  // dispatch
  const dispatch = useDispatch();
  // selector
  const blogId = useSelector((state) => state.blog.blogId.blogId);
  // state
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  // mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["delete-blog"],
    mutationFn: BlogService.deleteBlog,
    onMutate: () => {
      setIsPreventSubmit(true);
    },
    onSuccess: () => {
      toast.success("Delete blog successful", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        setIsPreventSubmit(false);
        location.reload();
      }, 1500);
      queryClient.invalidateQueries(["blogs"]);
    },
  });

  // handle func
  const handleToggleDelBlogModal = () => {
    dispatch(toggleDelBlogModal());
  };
  const handleDelBlog = async () => {
    if (isPreventSubmit) {
      toast.error("On processing, try again!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { width: "400px" },
      });
      return;
    }
    try {
      await mutation.mutateAsync(blogId);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="del-blog-modal-container">
      <ToastContainer />
      <div className="del-blog-modal">
        <i className="bx bxs-error"></i>
        <strong>Delete Blog</strong>
        <p>You're going to delete this blog. Are you sure?</p>
        <span>Blog ID: {blogId}</span>
        <div className="button">
          <button onClick={handleToggleDelBlogModal}>No, Keep it.</button>
          <button onClick={handleDelBlog}>Yes, Delete!</button>
        </div>
      </div>
    </div>
  );
};
