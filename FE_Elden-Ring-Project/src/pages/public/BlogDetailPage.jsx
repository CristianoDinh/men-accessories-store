import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// import styles
import "../../styles/public/blogdetail/blogdetail.css";
// import components
import { Navbar } from "../../components/navbar/Navbar";
import { AdvanceNavbar } from "../../components/navbar/AdvanceNavbar";
import { Footer } from "../../components/footer/Footer";
// import service
import * as BlogService from "../../service/blog/blog";
export const BlogDetailPage = () => {
  // location
  const location = useLocation();
  const { blogInfo } = location.state;
  // query
  const { data: blogList = [] } = useQuery({
    queryKey: ["blogList"],
    queryFn: BlogService.getBlogList,
    refetchOnWindowFocus: false,
  });
  return (
    <div className="blog-detail-container">
      <Navbar />
      <AdvanceNavbar />
      <div className="blog-detail">
        <div className="header">
          <span>By {blogInfo.fullname}</span>
          <strong>{blogInfo.title}</strong>
          <p>Posted at {blogInfo.createDate}</p>
        </div>
        <img src={blogInfo.image} alt="" />
        <div className="main">
          <div className="content">
            <p>{blogInfo.content}</p>
          </div>
          <div className="utils">
            <div className="list">
              <strong>Explore posts</strong>
              {blogList?.slice(0, 4).map((blog) => (
                <Link
                  state={{ blogInfo: blog }}
                  to={`/blogdetail/${blog.blogId}`}
                  key={blog.blogId}
                >
                  {blog.title}
                </Link>
              ))}
            </div>
            <div className="list">
              <strong>Share this article</strong>
              <div>
                <i className="bx bxl-instagram-alt"></i>
                <p>Instagram</p>
              </div>
              <div>
                <i className="bx bxl-facebook-circle"></i>
                <p>Facebook</p>
              </div>
              <div>
                <i className="bx bx-link-alt"></i>
                <p>Copy URL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
