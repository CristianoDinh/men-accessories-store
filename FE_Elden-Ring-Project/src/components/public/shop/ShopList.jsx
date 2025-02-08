import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// import styles
import "../../../styles/components/public/shop/shop.css";

import cate1 from "../../../assets/category1.jpg";
import cate2 from "../../../assets/category2.jpg";
import cate3 from "../../../assets/category3.jpg";
import cate4 from "../../../assets/category4.jpg";
// import service
import * as ProductService from "../../../service/product/product";
import * as CategoryService from "../../../service/category/category";
import { ClipLoader } from "react-spinners";
export const ShopList = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  // param
  const { cateId } = useParams();
  // state
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [productFromCate, setProductFromCate] = useState([]);
  const [isEmptyList, setIsEmptyList] = useState(false);

  // query
  const {
    data: productList = [],
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["products", cateId],
    queryFn: () =>
      cateId
        ? CategoryService.getProductShopByCateId(cateId)
        : ProductService.getAllShop(),
    refetchOnWindowFocus: false,
  });

  const filteredProducts = cateId
    ? productFromCate?.filter((product) =>
        product?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : productList?.filter((product) =>
        product?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
    if (cateId) {
      setProductFromCate(Array.isArray(productList) ? productList : []);
    }
    if (filteredProducts?.length === 0) {
      setIsEmptyList(true);
    } else {
      setIsEmptyList(false);
    }
  }, [isFetching, isLoading, isError, filteredProducts]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  return (
    <>
      <div className="category">
        <Link to="/shop/category/3">
          <img src={cate1} alt="" />
          <div>
            <strong>Watches</strong>
          </div>
        </Link>
        <Link to="/shop/category/2">
          <img src={cate2} alt="" />
          <div>
            <strong>Rings</strong>
          </div>
        </Link>
        <Link to="/shop/category/1">
          <img src={cate3} alt="" />
          <div>
            <strong>Bags</strong>
          </div>
        </Link>
        <Link to="/shop/category/4">
          <img src={cate4} alt="" />
          <div>
            <strong>Necklace</strong>
          </div>
        </Link>
      </div>
      <div className="shop-list-container">
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
        ) : (
          <>
            <div className="utils">
              <div className="search">
                <i className="bx bx-search"></i>
                <input
                  type="text"
                  placeholder="Search product by name..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="main">
              {isEmptyList ? (
                <>
                  <div className="empty-list">
                    <p>
                      Product list is empty or product name search not found
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {!user && !token ? (
                    <>
                      {filteredProducts?.map((product) => (
                        <div key={product.productId} className="item">
                          <img src={product.image} alt="" />
                          <strong>{product.name}</strong>
                          <strong>{formatPrice(product.price)}</strong>
                          <Link
                            state={{ productInfo: product }}
                            to={`/productdetail/${product.productId}`}
                          >
                            View Detail
                          </Link>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {filteredProducts?.map((product) => (
                        <div key={product.productId} className="item">
                          <img src={product.image} alt="" />
                          <strong>{product.name}</strong>
                          <strong>{formatPrice(product.price)}</strong>
                          <Link
                            state={{ productInfo: product }}
                            to={`/productdetail/${product.productId}`}
                          >
                            Choose Size
                          </Link>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
