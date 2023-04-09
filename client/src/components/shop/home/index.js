import React, { Fragment, createContext, useReducer } from "react";
import Layout from "../layout";
import Slider from "./Slider";
import ProductCategory from "./ProductCategory";
import { homeState, homeReducer } from "./HomeContext";
import SingleProduct from "./SingleProduct";
import alanBtn from "@alan-ai/alan-sdk-web";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { LayoutContext } from "../index";
import { useRef } from "react";
import { fireEvent } from "@testing-library/react";
import { logout } from "../partials/Action";
import { cartList, inCart } from "../productDetails/Mixins";
import { fetchData } from "../order/Action";
import { totalCost } from "../partials/Mixins";
import { cartListProduct } from "../partials/FetchApi";

export const HomeContext = createContext();

const HomeComponent = () => {
  const categoryRef = useRef(null);
  const history = useHistory();
  const { dispatch: layoutDispatch } = useContext(LayoutContext);
  const { data: homeData, dispatch: homeDispatch } = useContext(HomeContext);

  useEffect(() => {
    if (!homeData.loading || homeData.products.length === 0) return;

    function sendCategory() {
      alanBtnInstance.activate();
      // Calling the project API method on button click
      alanBtnInstance.callProjectApi(
        "listCategories",
        {
          categories: "Health and Beauty, Sports , Fashion , Electronics",
        },
        function (error, result) {}
      );
    }

    var alanBtnInstance = alanBtn({
      //key: 'd22e60a51299e6155cfe9d61365910e42e956eca572e1d8b807a3e2338fdd0dc/stage',
      key: "5e3df0d79bb4f3b6741d7acd6b2bfb412e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: (commandData) => {
        if (commandData.command === "showCart") {
          // Navber.cartModalOpen();
          layoutDispatch({ type: "cartModalToggle", payload: true });
        } else if (commandData.command === "closeCart") {
          layoutDispatch({ type: "cartModalToggle", payload: false });
        } else if (commandData.command === "showProduct") {
          // alanBtnInstance.playText(commandData.title);

          const foundProduct = homeData.products.find((product) =>
            product.pName
              .toLowerCase()
              .includes(commandData.title.toLowerCase())
          );

          if (foundProduct) {
            history.push("/products/" + foundProduct._id);
            alanBtnInstance.playText("Sure, Showing " + foundProduct.pName);
          }

          if (!foundProduct)
            alanBtnInstance.playText(
              "product not available or incorrect product name"
            );
        } else if (commandData.command === "removeCart") {
          // alanBtnInstance.playText(commandData.title);

          const foundProduct = homeData.products.find((product) =>
            product.pName
              .toLowerCase()
              .includes(commandData.title.toLowerCase())
          );

          if (!foundProduct)
            alanBtnInstance.playText(
              "product not available or incorrect product name"
            );

          if (inCart(foundProduct._id)) {
            const id = foundProduct._id;
            let cart = localStorage.getItem("cart")
              ? JSON.parse(localStorage.getItem("cart"))
              : [];
            if (cart.length !== 0) {
              cart = cart.filter((item) => item.id !== id);
              localStorage.setItem("cart", JSON.stringify(cart));
              fetchData(cartListProduct, layoutDispatch);
              layoutDispatch({ type: "inCart", payload: cartList() });
              layoutDispatch({ type: "cartTotalCost", payload: totalCost() });
            }
            if (cart.length === 0) {
              layoutDispatch({ type: "cartProduct", payload: null });
              fetchData(cartListProduct, layoutDispatch);
              layoutDispatch({ type: "inCart", payload: cartList() });
            }

            alanBtnInstance.playText("Sure! Product removed from your cart.");
          } else {
            alanBtnInstance.playText("Sorry! That is not in your cart yet.");
          }
        } else if (commandData.command === "TypeUsername") {
          const usernameEle = document.getElementById("name");
          if (!usernameEle)
            alanBtnInstance.playText("Please open login page first");

          fireEvent.input(usernameEle, {
            target: { value: commandData.title.toLowerCase() },
          });

          alanBtnInstance.playText(
            "Username entered, Please enter your password next."
          );
        } else if (commandData.command === "TypePassword") {
          const passwordEle = document.getElementById("password");
          if (!passwordEle)
            alanBtnInstance.playText("Please open login page first");

          passwordEle.focus();
          fireEvent.input(passwordEle, {
            target: { value: commandData.title.toLowerCase() },
          });
          alanBtnInstance.playText("Password entered, initiating log in.");

          document.getElementById("loginBtn").click();
          alanBtnInstance.playText("login successful.");

          setTimeout(() => {
            const loginErrors = document.querySelectorAll("#loginErrors");

            if (loginErrors) {
              console.log(loginErrors);
              loginErrors.forEach((error) => {
                alanBtnInstance.playText("error: " + error.textContent);
              });
            }
          }, 500);
        } else if (commandData.command === "Wishlist") {
          history.push("/wish-list");
        } else if (commandData.command === "UserProfile") {
          history.push("/user/profile");
        } else if (commandData.command === "UserOrders") {
          history.push("/user/orders");
        } else if (commandData.command === "SettingUser") {
          history.push("/user/setting");
        } else if (commandData.command === "Home") {
          history.push("/");
        } else if (commandData.command === "ContactUs") {
          history.push("/contact-us");
        } else if (commandData.command === "DashboardAdmin") {
          history.push("/admin/dashboard");
        } else if (commandData.command === "Categories") {
          history.push("/admin/dashboard/categories");
        } else if (commandData.command === "Products") {
          history.push("/admin/dashboard/products");
        } else if (commandData.command === "Orders") {
          history.push("/admin/dashboard/orders");
        } else if (commandData.command === "ListCategories") {
          sendCategory();
          history.push("/");
          homeDispatch({
            type: "categoryListDropdown",
            payload: !homeData.categoryListDropdown,
          });

          categoryRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else if (commandData.command === "Electronics") {
          history.push("/products/category/634b130eb5966b04d490e0a5");
        } else if (commandData.command === "Fashion") {
          history.push("/products/category/634b149ab5966b04d490e0c8");
        } else if (commandData.command === "HomenGarden") {
          history.push("/products/category/634b15d2b5966b04d490e0cc");
        } else if (commandData.command === "Sports") {
          history.push("/products/category/635216b8fea69c47a46fc014");
        } else if (commandData.command === "HealthnBeauty") {
          history.push("/products/category/6352175afea69c47a46fc02f");
        } else if (commandData.command === "Collectibles") {
          history.push("/products/category/63521846fea69c47a46fc055");
        } else if (commandData.command === "Login") {
          layoutDispatch({ type: "loginSignupModalToggle", payload: true });
          alanBtnInstance.playText("Please enter your username and password.");
        } else if (commandData.command === "logout") {
          logout();
        } else if (commandData.command === "closeLogin") {
          layoutDispatch({ type: "loginSignupModalToggle", payload: false });
        } else if (commandData.command === "addToCart") {
          const addCartBtn = document.querySelector("#addToCart");
          const inCart = document.querySelector("#inCart");

          if (!addCartBtn || inCart)
            alanBtnInstance("Functionality not available on this page");

          addCartBtn.click();

          alanBtnInstance.playText("Product added to cart.");
        } else if (commandData.command === "increase") {
          const increaseBtn = document.querySelector("#increase");
          const quantityNotAvailable = document.querySelector(
            "#quantityNotAvailable"
          );

          if (!increaseBtn || quantityNotAvailable)
            alanBtnInstance("Functionality not available on this page");

          increaseBtn.click();
          alanBtnInstance.playText("Quantity increased.");
        } else if (commandData.command === "decrease") {
          const decreaseBtn = document.querySelector("#decrease");
          const quantityNotAvailable = document.querySelector(
            "#quantityNotAvailable"
          );

          if (!decreaseBtn || quantityNotAvailable)
            alanBtnInstance("Functionality not available on this page");

          decreaseBtn.click();
          alanBtnInstance.playText("Quantity Decreased.");
        } else if (commandData.command === "scrollDown") {
          document.scrollingElement.scrollBy({
            behavior: "smooth",
            top: 300,
          });
        } else if (commandData.command === "scrollUp") {
          document.scrollingElement.scrollBy({
            behavior: "smooth",
            top: -300,
          });
        } else if (commandData.command === "describeProduct") {
          const description = document.getElementById("productDescription");

          if (!description) {
            alanBtnInstance.playText(
              "Sorry! you are not viewing any product currently."
            );
            return;
          }

          alanBtnInstance.playText("sure! " + description.innerText);
        } else if (commandData.command === "readPrice") {
          const price = document.getElementById("productPrice");

          if (!price) {
            alanBtnInstance.playText(
              "Sorry! You are not viewing any product currently."
            );
            return;
          }

          alanBtnInstance.playText("It is of " + price.innerText + " only!");
        } else if (commandData.command === "addToWishlist") {
          const wishlistBtn = document.getElementById("wishlistBtn");

          if (!wishlistBtn) {
            alanBtnInstance.playText(
              "Sorry! You are not viewing any product currently."
            );
            return;
          }

          wishlistBtn.click();
          alanBtnInstance.playText(
            "Sure! Adding this product to your wishlist."
          );
        }
      },
    });
  }, [history, homeData.loading, homeData.products]);

  return (
    <Fragment>
      <Slider />
      {/* Category, Search & Filter Section */}
      <section className="m-4 md:mx-8 md:my-6" ref={categoryRef}>
        <ProductCategory />
      </section>
      {/* Product Section */}
      <section className="m-4 md:mx-8 md:my-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <SingleProduct />
      </section>
      {/* {(!homeData.loading) && <Alan />} */}
    </Fragment>
  );
};

const Home = (props) => {
  const [data, dispatch] = useReducer(homeReducer, homeState);
  return (
    <Fragment>
      <HomeContext.Provider value={{ data, dispatch }}>
        <Layout children={<HomeComponent />} />
      </HomeContext.Provider>
    </Fragment>
  );
};

export default Home;
