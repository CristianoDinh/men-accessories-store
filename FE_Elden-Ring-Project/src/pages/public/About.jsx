import React, { useEffect } from "react";
import "../../styles/public/about/about.css";
import { Navbar } from "../../components/navbar/Navbar";
import { AdvanceNavbar } from "../../components/navbar/AdvanceNavbar";
import { Footer } from "../../components/footer/Footer";

// import assets
import about1 from "../../assets/about1.jpg";
import about2 from "../../assets/about2.jpg";
import about3 from "../../assets/about3.jpg";
import about4 from "../../assets/about4.jpg";
import about5 from "../../assets/about5.jpg";
import about6 from "../../assets/about6.jpg";
import about7 from "../../assets/about7.jpg";
import about8 from "../../assets/about8.jpg";
import about9 from "../../assets/about9.jpg";
import about10 from "../../assets/about10.jpg";
import about11 from "../../assets/about11.jpg";
import about12 from "../../assets/about12.jpg";
import about13 from "../../assets/about13.jpg";
import about14 from "../../assets/about14.jpg";
export const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="about-container">
      <Navbar />
      <AdvanceNavbar />
      <div className="about">
        <div className="we-are-title">
          <h1>WE ARE ELDEN RING!</h1>
          <div className="img-header">
            <img src={about1} alt="" />
            <img src={about2} alt="" />
            <img src={about3} alt="" />
            <img src={about4} alt="" />
            <img src={about5} alt="" />
            <img src={about6} alt="" />
          </div>
        </div>
        <div className="we-are-title2">
          <h1>
            Uniquely designed, handcrafted, each piece tells a separate story.
          </h1>
          <p>Let accessories be the final highlight of your outfit!</p>
        </div>
        <div className="we-are-title3">
          <h1>BOLD AND UNIQUE!</h1>
          <div className="img-header">
            <img src={about7} alt="" />
            <img src={about8} alt="" />
            <img src={about9} alt="" />
          </div>
        </div>
        <div className="we-are-title4">
          <h1>BE STABLE!</h1>
          <div className="img-header">
            <img src={about10} alt="" />
            <img src={about11} alt="" />
          </div>
        </div>
        <div className="who-we-are">
          <h1>ELDENRING - WHO ARE WE?</h1>
          <div className="text-container">
            <div className=""></div>
            <div className="">
              <p>
                Established in 2016, EldenRing is a fashion accessories brand
                that offers unique and distinctive craftsmanship. Not only
                accompanying men on the journey of discovery and expressing
                personal style, EldenRing always strives to spread the passion
                and love for works made by Vietnamese people, and at the same
                time bring those works to life. reaching out to the world
                strongly and proudly.
              </p>
              <strong>Strong! Bold! Unique!</strong>
              <p>
                This is the core spirit Helios always aims for and is expressed
                through each product. Inspired by stories revolving around men's
                lives, we create unique, unique creations that cannot be found
                anywhere else.
              </p>
            </div>
          </div>
        </div>
        <div className="who-we-are">
          <h1>WHAT MAKES ELDENRING?</h1>
          <div className="text-container">
            <div className="">
              <strong>STANDARD</strong>
              <p>
                With a passion for handmade jewelry, Helios constantly listens
                and perfects itself day by day, thereby providing customers with
                committed STANDARD experiences, services and products.
              </p>
              <strong>QUALITY</strong>
              <p>
                Different from many brands on the market, we take inspiration
                from every aspect of life, combining them with bold thinking to
                create unique products with strong style and cool quality.
              </p>
            </div>
            <div className=""></div>
          </div>
        </div>
        <div className="who-we-are">
          <h1>ELDENRING'S JOURNEY IN THE NEXT 5 YEARS?</h1>
          <div className="text-container">
            <div className=""></div>
            <div className="">
              <p>
                In recent years, the handicraft industry in Vietnam has begun to
                reach foreign markets. However, compared to international brands
                in the same industry, the competitiveness of Vietnamese brands
                is still low.
              </p>
              <p style={{ marginTop: "15px" }}>
                This situation comes from many reasons, the most notable of
                which is the lack of investment in the design stage. In
                particular, copying and imitating foreign brands further wastes
                the true value and creative potential of the Vietnamese
                handicraft industry.
              </p>
            </div>
          </div>
        </div>
        <div className="design">
          <h1>DESIGN</h1>
          <div className="design-content">
            <img src={about12} alt="" />
            <strong>INSPIRATION</strong>
            <p>
              Exploiting aspects surrounding men, Helios searched for an iconic
              image with a strong connection to their story.
            </p>
            <strong>SKETCH</strong>
            <p>
              Based on the main symbol, the design team began sketching the
              first images on paper drawings. Stylized lines need to convey the
              true spirit of the idea, and also show the unique mark that only
              Helios has.
            </p>
            <strong>3D MODEL</strong>
            <p>
              From hand-drawn sketches, the digital design team creates 3D
              models with the help of graphics software. This model is then 3D
              printed with a waxy liquid material, specifically serving the
              metal casting field. The printed wax blank is the original mold of
              the craft.
            </p>
          </div>
          <div className="design-content">
            <img src={about13} alt="" />
            <strong>CLOSED SILVER WORKSHOP</strong>
            <p>
              In a closed silver workshop, EldenRing's craftsmen carry out the
              process of creating molds from wax trees. Using high-quality S925
              silver, melt it and pour it into a mold to create a silver tree,
              each branch corresponding to a product. Once the silver tree is
              obtained, each branch is separated in turn and goes through the
              stages of honing - polishing - blackening.
            </p>

            <p>
              The entire process is done carefully and meticulously by the hands
              of skilled workers. Therefore, each product is unique, there
              certainly cannot be a second identical copy.
            </p>
          </div>
          <div className="design-content">
            <img src={about14} alt="" />
            <strong>PERFECT MADE</strong>
            <p>
              Once the production stage is completed, the quality department
              inspects and evaluates each product, ensuring both visual and
              practical experience when used.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
