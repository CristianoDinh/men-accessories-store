import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
// import styles
import "../../../styles/components/private/blog/blog.css";
// import assets
import image from "../../../assets/blog.jpg";
// import slices
import {
  toggleAddBlogModal,
  toggleAnimateBlogModalOn,
  togglePreviewBlogModalOn,
} from "../../../redux/slices/modal/modal";
import { setBlogId } from "../../../redux/slices/blog/blog";
// import service
import * as BlogService from "../../../service/blog/blog";
import { ClipLoader } from "react-spinners";
export const BlogList = () => {
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [isEmptyList, setIsEmptyList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // query
  const {
    data: blogList = [],
    isFetching,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: BlogService.getBlogList,
  });
  // handle func
  const filteredBlogs = blogList?.filter((blog) =>
    blog?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleToggleAddBlogModal = () => {
    dispatch(toggleAddBlogModal());
  };
  const handleTogglePreviewBlogModalOn = (blogId) => {
    dispatch(setBlogId(blogId));
    dispatch(togglePreviewBlogModalOn());
    setTimeout(() => {
      dispatch(toggleAnimateBlogModalOn());
    }, 1);
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
    if (filteredBlogs?.length === 0) {
      setIsEmptyList(true);
    } else {
      setIsEmptyList(false);
    }
  }, [isError, isFetching, isLoading, filteredBlogs]);
  return (
    <div className="blog-list-container">
      <div className="utils">
        <div className="section-1">
          <div className="utils-header">
            <strong>Blog list</strong>
            <p>total {blogList?.length} blogs</p>
          </div>
          <div className="buttons">
            <div className="add-btn" onClick={handleToggleAddBlogModal}>
              <i className="bx bx-plus"></i>
              <p>Add Blog</p>
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
      <div className="blog-list">
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
              <p>Blog you looking for is not found</p>
            </div>
          </>
        ) : (
          <>
            {filteredBlogs?.map((blog) => (
              <div
                key={blog.blogId}
                className="blog-item"
                onClick={() => handleTogglePreviewBlogModalOn(blog.blogId)}
              >
                <img src={blog.image} alt="" />
                <div>
                  <strong>{blog.title}</strong>
                  <p>
                    Posted at{" "}
                    {new Date(blog.createDate).toLocaleDateString("en-GB")}
                  </p>
                  <small>By {blog.fullname}</small>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
