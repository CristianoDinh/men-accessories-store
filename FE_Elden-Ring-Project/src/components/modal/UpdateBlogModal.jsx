import React, { useEffect, useRef, useState } from "react";
import FileResizer from "react-image-file-resizer";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
// import slices
import { toggleUpdateBlogModal } from "../../redux/slices/modal/modal";
// import service
import * as BlogService from "../../service/blog/blog";
import { ClipLoader } from "react-spinners";
export const UpdateBlogModal = () => {
  // use ref
  const formRef = useRef(null);
  // dispatch
  const dispatch = useDispatch();
  // selector
  const blogId = useSelector((state) => state.blog.blogId.blogId);
  // state
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  const [submitData, setSubmitData] = useState({
    image: "",
    title: "",
    content: "",
  });
  // query
  const {
    data: blogInfo = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["blog-detail", blogId],
    queryFn: () => BlogService.getBlogDetail(blogId),
  });
  // mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["update-blog", blogId],
    mutationFn: (updateData) => {
      BlogService.updateBlog(blogId, updateData);
    },
    onMutate: () => {
      setIsPreventSubmit(true);
    },
    onSuccess: () => {
      toast.success("Update blog successful", {
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
  // file
  const resizeFile = (file) => {
    if (!file) return;
    FileResizer.imageFileResizer(
      file,
      300,
      300,
      "PNG",
      300,
      0,
      (uri) => {
        setPreviewImage(uri);
        setSubmitData((prevData) => ({
          ...prevData,
          image: uri,
        }));
      },
      "base64",
      250,
      250
    );
  };
  //   handle func
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSubmitData({
      ...submitData,
      [name]: value,
    });
  };
  const handleToggleUpdateBlogModal = () => {
    dispatch(toggleUpdateBlogModal());
  };
  const removeChooseImage = () => {
    setPreviewImage(null);
    setSubmitData({
      ...submitData,
      image: "",
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
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
      });
      return;
    }
    if (
      submitData.content === "" ||
      submitData.image === "" ||
      submitData.title === ""
    ) {
      toast.error("Please input all fields", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    try {
      await mutation.mutateAsync(submitData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };
  useEffect(() => {
    if (isFetching || isLoading) {
      setIsLoadingModal(true);
    } else {
      setIsLoadingModal(false);
    }
    if (blogInfo) {
      setSubmitData({
        content: blogInfo?.content,
        image: blogInfo?.image,
        title: blogInfo?.title,
      });
      if (blogInfo.image) {
        setPreviewImage(blogInfo?.image);
      }
    }
  }, [isFetching, isLoading]);
  return (
    <div className="update-blog-modal-container">
      <ToastContainer />
      {isLoadingModal ? (
        <>
          <div className="loading">
            <ClipLoader color="#ffffff" size={50} />
          </div>
        </>
      ) : (
        <>
          <div className="update-blog-modal">
            <div className="header">
              <div>
                <i className="bx bx-book-content"></i>
                <p>Update Blog</p>
              </div>
              <i className="bx bx-x" onClick={handleToggleUpdateBlogModal}></i>
            </div>
            <form
              action=""
              onSubmit={handleOnSubmit}
              ref={formRef}
              autoComplete="new-password"
              className="update-blog-form"
            >
              <div className="input-image">
                <div>
                  {previewImage ? (
                    <>
                      <label htmlFor="image">
                        <img src={previewImage} alt="" />
                      </label>
                    </>
                  ) : (
                    <>
                      <label htmlFor="image">
                        <i className="bx bx-image-add"></i>
                        <p>Click to choose image for blog header</p>
                      </label>
                    </>
                  )}
                  <input
                    type="file"
                    name=""
                    id="image"
                    onChange={(e) => resizeFile(e.target.files[0])}
                  />
                </div>
                <small onClick={removeChooseImage}>Clear the image</small>
              </div>
              <div className="input-item">
                <label htmlFor="">Blog title*</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={submitData.title}
                  onChange={handleOnChange}
                  placeholder="Enter title..."
                />
                <small>Input the blog title here</small>
              </div>
              <div className="input-content">
                <label htmlFor="">Content*</label>
                <textarea
                  name="content"
                  defaultValue={submitData.content}
                  onChange={handleOnChange}
                  id=""
                  placeholder="Enter content..."
                ></textarea>
                <small>Input the blog content here</small>
              </div>
            </form>
            <div className="submit">
              <button onClick={handleToggleUpdateBlogModal}>Return</button>
              <button onClick={handleExternalSubmit}>
                Confirm update blog
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
