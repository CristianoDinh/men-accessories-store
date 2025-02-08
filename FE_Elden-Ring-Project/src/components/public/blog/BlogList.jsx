import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// import styles
import "../../../styles/components/public/blog/blog.css";
// import assets
import image from "../../../assets/category2.jpg";
// import service
import * as BlogService from "../../../service/blog/blog";
import { ClipLoader } from "react-spinners";
export const BlogList = () => {
  // state
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [isEmptyList, setIsEmptyList] = useState(false);
  //   query
  const {
    data: blogList = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["blogList"],
    queryFn: BlogService.getBlogList,
  });
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
    if (blogList?.length === 0) {
      setIsEmptyList(true);
    } else {
      setIsEmptyList(false);
    }
  }, [isFetching, isLoading, isError, blogList]);
  return (
    <div className="blog-public-list-container">
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
            <p>
              We are not posted any blogs yet, we will post as soon as posible
            </p>
          </div>
        </>
      ) : (
        <>
          <Link
            state={{ blogInfo: blogList[0] }}
            to={`/blogdetail/${blogList[0]?.blogId}`}
            className="header-blog"
          >
            <img src={blogList[0]?.image || ""} alt="" />
            <div className="detail">
              <span>The newest</span>
              <strong>{blogList[0]?.title}</strong>
              <p>{blogList[0]?.content}</p>
              <div className="info">
                <i className="bx bx-user-circle"></i>
                <div>
                  <strong>by {blogList[0]?.fullname}</strong>
                  <p>Posted at {blogList[0]?.createDate}</p>
                </div>
              </div>
            </div>
          </Link>
          <div className="list">
            {blogList?.map((blog) => (
              <Link
                state={{ blogInfo: blog }}
                to={`/blogdetail/${blog.blogId}`}
                key={blog.blogId}
                className="blog-item"
              >
                <img src={blog.image} alt="" />
                <strong>{blog.title}</strong>
                <p>{blog.content}</p>
                <div className="info">
                  <i className="bx bx-user-circle"></i>
                  <div>
                    <strong>by {blog.fullname}</strong>
                    <p>Posted at {blog.createDate}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
