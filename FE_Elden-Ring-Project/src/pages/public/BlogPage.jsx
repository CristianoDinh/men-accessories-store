import React, { useEffect } from "react";

// import styles
import "../../styles/public/blog/blog.css";
// import components
import { Navbar } from "../../components/navbar/Navbar";
import { AdvanceNavbar } from "../../components/navbar/AdvanceNavbar";
import { Footer } from "../../components/footer/Footer";
import { BlogList } from "../../components/public/blog/BlogList";

export const BlogPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="blog-container">
      <Navbar />
      <AdvanceNavbar />
      <div className="blogs">
        <div className="header">
          <p>The Blog</p>
          <strong>Writing from EldenRing</strong>
          <span>The lastest news, styles and trends</span>
        </div>
        <BlogList />
      </div>
      <Footer />
    </div>
  );
};
