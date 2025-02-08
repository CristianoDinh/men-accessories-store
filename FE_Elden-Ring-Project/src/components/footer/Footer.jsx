import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/footer/footer.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// import assets
import image from "../../assets/footer.png";
export const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer">
        <div className="link-list">
          <div className="list">
            <strong>Quick Links</strong>
            <div>
              <Link>Home</Link>
              <Link>Shop</Link>
              <Link>About</Link>
              <Link>Contact</Link>
            </div>
          </div>
          <div className="list">
            <strong>Resources</strong>
            <div>
              <Link>FAQ</Link>
              <Link>Shipping & returns</Link>
              <Link>Size chart</Link>
            </div>
          </div>
          <div className="list">
            <strong>Social</strong>
            <div>
              <Link>Instagram</Link>
              <Link>Facebook</Link>
              <Link>Github</Link>
            </div>
          </div>
        </div>
        <div className="info">
          <p>eldenring@gmail.com</p>
          <p>All Rights Reserved @2024 - EldenRing</p>
        </div>
      </div>
      <div className="image">
        <LazyLoadImage alt="" effect="blur" src={image}></LazyLoadImage>
      </div>
    </div>
  );
};
