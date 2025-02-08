import { useEffect } from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useMutation, useQuery } from "@tanstack/react-query";
// import styles
import "./styles/public/homepage/homepage.css";
// import components
import { Navbar } from "./components/navbar/Navbar";
import { AdvanceNavbar } from "./components/navbar/AdvanceNavbar";
import { Footer } from "./components/footer/Footer";
import "react-toastify/dist/ReactToastify.css";
// import assets
import banner from "./assets/homepage-banner.jpg";
import product from "./assets/Fashion-Accessories-Web-1.jpg";
import about from "./assets/about.jpg";
import newsletter from "./assets/newsletter.jpg";
import blog1 from "./assets/blog1.jpg";
import blog2 from "./assets/blog2.jpg";
import blog3 from "./assets/blog3.jpg";
import blog4 from "./assets/blog4.jpg";
import product1 from "./assets/product1.jpg";
import product2 from "./assets/product2.jpg";
import product3 from "./assets/product3.jpg";
import product4 from "./assets/product4.jpg";
import product5 from "./assets/product5.jpg";
import product6 from "./assets/product6.jpg";
import product7 from "./assets/product7.jpg";
import product8 from "./assets/product8.jpg";
import product9 from "./assets/product9.jpg";
import product10 from "./assets/product10.jpg";
import product11 from "./assets/product11.jpg";
import product12 from "./assets/product12.jpg";
// import service
import * as AccountService from "./service/account/account";
import * as CartService from "./service/cart/cart";
import * as ProductService from "./service/product/product";
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1536 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1536, min: 1024 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  smallMobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
export const App = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  // query
  const { data: productList = [] } = useQuery({
    queryKey: ["products"],
    queryFn: ProductService.getAllShop,
    refetchOnWindowFocus: false,
  });
  // mutation
  const mutation = useMutation({
    mutationKey: ["authenticate"],
    mutationFn: AccountService.authenticateService,
  });
  const cartMutation = useMutation({
    mutationKey: ["create-cart"],
    mutationFn: CartService.createCart,
  });
  // handle func
  const handleAuth = async () => {
    try {
      if (token && user) {
        await mutation.mutateAsync(token);
        await cartMutation.mutateAsync(user?.userId);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    handleAuth();
  }, []);
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  return (
    <div className="homepage-container">
      <Navbar />
      <AdvanceNavbar />
      <div className="homepage">
        <div className="homepage-banner">
          <LazyLoadImage src={banner} alt="Homepage Banner" effect="opacity" />
          <div>
            <strong>
              Every man deserves accessories that mirror his ambition and style
            </strong>
            <Link to="/shop">Visit Shop</Link>
          </div>
        </div>
        <div className="discover">
          <div className="header">
            <p>Discover the</p>
            <strong>Refined Minimalism</strong>
          </div>
          <Carousel
            responsive={responsive}
            swipeable={true}
            draggable={true}
            showDots={false}
            infinite={true}
            arrows={false}
            autoPlay={false}
            keyBoardControl={true}
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {productList?.slice(0, 8)?.map((product) => (
              <Link
                key={product.productId}
                to={`/productdetail/${product.productId}`}
                className="carousel-item"
              >
                <p>{formatPrice(product.price)}</p>
                <LazyLoadImage src={product.image} alt="" effect="opacity" />
                <strong>{product.name}</strong>
              </Link>
            ))}
          </Carousel>
        </div>
        <div className="about">
          <LazyLoadImage src={about} alt="Homepage Banner" effect="opacity" />
          <div>
            <strong>
              Crafted with attention to detail, each piece tells a story of
              elegance and confidence.
            </strong>
            <Link to="/about">About Us</Link>
          </div>
        </div>
        <div className="category">
          <div className="category-list">
            <LazyLoadImage src={product1} alt="" effect="opacity" />

            <Link to="/shop/category/3">
              <strong>Watches</strong>
              <div>
                <p>View all watches</p>
                <i className="bx bx-right-top-arrow-circle"></i>
              </div>
            </Link>
            <LazyLoadImage src={product2} alt="" effect="opacity" />

            <LazyLoadImage src={product3} alt="" effect="opacity" />
          </div>
          <div className="category-list">
            <Link to="/shop/category/1">
              <strong>Bags</strong>
              <div>
                <p>View all bags</p>
                <i className="bx bx-right-top-arrow-circle"></i>
              </div>
            </Link>
            <LazyLoadImage src={product4} alt="" effect="opacity" />

            <LazyLoadImage src={product5} alt="" effect="opacity" />

            <LazyLoadImage src={product6} alt="" effect="opacity" />
          </div>
          <div className="category-list">
            <LazyLoadImage src={product7} alt="" effect="opacity" />

            <LazyLoadImage src={product8} alt="" effect="opacity" />

            <LazyLoadImage src={product9} alt="" effect="opacity" />
            <Link to="/shop/category/2">
              <strong>Rings</strong>
              <div>
                <p>View all rings</p>
                <i className="bx bx-right-top-arrow-circle"></i>
              </div>
            </Link>
          </div>
          <div className="category-list">
            <LazyLoadImage src={product10} alt="" effect="opacity" />

            <LazyLoadImage src={product11} alt="" effect="opacity" />
            <Link to="/shop/category/4">
              <strong>Necklace</strong>
              <div>
                <p>View all necklace</p>
                <i className="bx bx-right-top-arrow-circle"></i>
              </div>
            </Link>

            <LazyLoadImage src={product12} alt="" effect="opacity" />
          </div>
        </div>
        <div className="newsletter">
          <LazyLoadImage src={newsletter} alt="" effect="opacity" />
          <div className="header">
            <strong>
              Sign up for our newsletter and receive 10% off your first order
            </strong>
            <div>
              <input type="text" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        <div className="blog">
          <div className="explore">
            <strong>Be Part of the Movement</strong>
            <p>
              Stay ahead of the trends with access to limited collections,
              exclusive deals, and insider news. Our community is your gateway
              to looking sharp, always.
            </p>
            <Link to="/blogs">Explore our community</Link>
          </div>
          <div className="images">
            <div>
              <LazyLoadImage src={blog1} alt="" effect="opacity" />

              <LazyLoadImage src={blog2} alt="" effect="opacity" />

              <LazyLoadImage src={blog3} alt="" effect="opacity" />
            </div>
            <img loading="lazy" className="big-img" src={blog4} alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
