import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router-dom";
// import styles
import "../../../styles/components/private/product/product.css";
// import slices
import { setProductId } from "../../../redux/slices/product/product";
// import assets

// import service
import * as ProductService from "../../../service/product/product";
import * as CategoryService from "../../../service/category/category";
import {
  toggleAddProductModal,
  toggleUpdateProductModal,
} from "../../../redux/slices/modal/modal";
import { ClipLoader } from "react-spinners";
export const ProductList = () => {
  // param
  const { cateId } = useParams();
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [productFromCate, setProductFromCate] = useState([]);
  const [isEmptyList, setIsEmptyList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
        ? CategoryService.getProductByCateId(cateId)
        : ProductService.getAllProduct(),
  });
  const { data: categoryList = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getListCategory,
  });
  const filteredProducts = cateId
    ? productFromCate?.filter((product) =>
        product?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : productList?.filter((product) =>
        product?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  const handleToggleAddProductModal = () => {
    dispatch(toggleAddProductModal());
  };
  const handleToggleUpdateProductModal = (productId) => {
    dispatch(setProductId(productId));
    dispatch(toggleUpdateProductModal());
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
    <div className="product-list-container">
      <div className="utils">
        <div className="section-1">
          <div className="utils-header">
            <strong>Inventory list</strong>
            <p>{filteredProducts?.length || 0} items</p>
          </div>
          <div className="buttons">
            <div className="add-btn" onClick={handleToggleAddProductModal}>
              <i className="bx bx-plus"></i>
              <p>Add products</p>
            </div>
          </div>
        </div>
        <div className="section-2">
          <div className="categories">
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to="/dashboard/product"
            >
              View all
            </NavLink>
            {categoryList?.map((cate) => (
              <NavLink
                key={cate.cateId}
                className={({ isActive }) => (isActive ? "active" : "")}
                to={`/dashboard/products/category/${cate.cateId}`}
              >
                {cate.cateName}
              </NavLink>
            ))}
          </div>
          <div className="filter">
            <div className="search">
              <i className="bx bx-search"></i>
              <input
                type="text"
                placeholder="Search for product name..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <table className="product-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Product</th>
            <th>Price</th>
            <th>In Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
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
                <p>Product list is empty or product name search not found</p>
              </div>
            </>
          ) : (
            <>
              {filteredProducts?.length > 0 ? (
                <>
                  {filteredProducts?.map((product, index) => (
                    <tr key={product.productId}>
                      <td>{index + 1}</td>
                      <td>
                        <img src={product.image} alt="" />
                        <div>
                          <strong>{product.name}</strong>
                          <p>{product.cateName}</p>
                        </div>
                      </td>
                      <td>{formatPrice(product.price)}</td>
                      <td>{product.stock}</td>
                      <td
                        className={
                          product.status ? "active-product" : "inactive-product"
                        }
                      >
                        <i className="bx bxs-circle"></i>
                        <p>{product.status ? "Active" : "Inactive"}</p>
                      </td>
                      <td>
                        <i
                          className="bx bx-edit-alt"
                          onClick={() =>
                            handleToggleUpdateProductModal(product.productId)
                          }
                        ></i>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  <div className="search-not-found">
                    <p>The product you looking for is not found</p>
                  </div>
                </>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};
