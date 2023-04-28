import React, { Fragment, createContext, useReducer, useState } from "react";
import Layout from "../layout";
import Slider from "./Slider";
import ProductCategory from "./ProductCategory";
import { homeState, homeReducer } from "./HomeContext";
import SingleProduct from "./SingleProduct";
import alanBtn from "@alan-ai/alan-sdk-web";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { LayoutContext, isAuthenticate } from "../index";
import { useRef } from "react";
import { fireEvent } from "@testing-library/react";
import { logout } from "../partials/Action";
import { cartList, inCart } from "../productDetails/Mixins";
import { fetchData } from "../order/Action";
import { quantity, totalCost } from "../partials/Mixins";
import { cartListProduct } from "../partials/FetchApi";
import { productReducer } from "../../admin/products/ProductContext";
import { isWish, isWishReq } from "./Mixins";
import { DashboardUserContext } from "../dashboardUser/Layout";
import { fetchOrderByUser } from "../dashboardUser/Action";
import {
  dashboardUserReducer,
  dashboardUserState,
} from "../dashboardUser/DashboardUserContext";

export const HomeContext = createContext();

const HomeComponent = () => {
  const categoryRef = useRef(null);
  const history = useHistory();

  const [dashboardData, dashboardDispatch] = useReducer(
    dashboardUserReducer,
    dashboardUserState
  );
  const { data: layoutData, dispatch: layoutDispatch } =
    useContext(LayoutContext);
  const { data: homeData, dispatch: homeDispatch } = useContext(HomeContext);

  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  );

  const fetchData = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        layoutDispatch({ type: "cartProduct", payload: responseData.Products });
        layoutDispatch({ type: "cartTotalCost", payload: totalCost() });
      }
      console.log(layoutData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchOrderByUser(dashboardDispatch);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !homeData?.loading ||
      homeData?.products?.length === 0 ||
      !layoutDispatch
    )
      return;

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
        } else if (commandData.command === "readOutCart") {
          if (layoutData.cartProduct?.length) {
            let cartReadText = `In your cart you have `;
            layoutData.cartProduct?.forEach((product) => {
              cartReadText += ` ${quantity(product._id)} ${product.pName}`;
            });

            alanBtnInstance.playText(cartReadText);
          } else {
            alanBtnInstance.playText("Your cart is empty");
          }
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
            alanBtnInstance.playText(
              "Sure, Showing " +
                foundProduct.pName +
                ". Do you want me to read out price and description for this product?"
            );
          }

          if (!foundProduct) {
            alanBtnInstance.playText(
              "product not available or incorrect product name"
            );
            return;
          }
        } else if (commandData.command === "removeCart") {
          // alanBtnInstance.playText(commandData.title);

          const foundProduct = homeData.products.find((product) =>
            product.pName
              .toLowerCase()
              .includes(commandData.title.toLowerCase())
          );

          // if (!foundProduct)
          //   alanBtnInstance.playText(
          //     "product not available or incorrect product name"
          //   );

          if (inCart(foundProduct._id)) {
            const id = foundProduct._id;
            let cart = localStorage.getItem("cart")
              ? JSON.parse(localStorage.getItem("cart"))
              : [];
            if (cart.length !== 0) {
              cart = cart.filter((item) => item.id !== id);
              console.log(cart);
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
          if (!passwordEle) {
            return;
          }

          passwordEle.focus();
          fireEvent.input(passwordEle, {
            target: {
              value: commandData.title.toLowerCase().replaceAll(" ", ""),
            },
          });
          alanBtnInstance.playText("Password entered, initiating log in.");

          document.getElementById("loginBtn").click();

          setTimeout(() => {
            const loginErrors = document.querySelectorAll("#loginErrors");

            if (loginErrors) {
              console.log(loginErrors);
              loginErrors?.forEach((error) => {
                alanBtnInstance.playText("error: " + error.textContent);
              });

              return;
            } else {
              alanBtnInstance.playText("login successful.");
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
        } else if (commandData.command === "FAQ") {
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
        } else if (commandData.command === "Sports") {
          history.push("/products/category/635216b8fea69c47a46fc014");
        } else if (commandData.command === "HealthnBeauty") {
          history.push("/products/category/6352175afea69c47a46fc02f");
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

          if (!addCartBtn || inCart) {
            alanBtnInstance.playText(
              "Functionality not available on this page"
            );
            return;
          }
          addCartBtn.click();

          alanBtnInstance.playText("Product added to cart.");
        } else if (commandData.command === "addToWishList") {
          const addCartBtn = document.querySelector("#addToCart");
          const inCart = document.querySelector("#inCart");

          const isProductPage = window.location.href.includes("products");

          if ((!addCartBtn || !inCart) && !isProductPage) {
            alanBtnInstance.playText(
              "Functionality not available on this page"
            );
            return;
          }

          const productUrl = window.location.href.split("/");

          const pId = productUrl[productUrl.length - 1];

          if (isWish(pId, wList)) {
            alanBtnInstance.playText("Product already in wishlist.");
            return;
          }

          isWishReq(undefined, pId, setWlist);

          alanBtnInstance.playText(
            "Product added to wishlist. Here, have a look at your wishlist."
          );

          setTimeout(() => {
            history.push("/wish-list");
          }, 400);
        } else if (commandData.command === "increase") {
          const increaseBtn = document.querySelector("#increase");
          const quantityNotAvailable = document.querySelector(
            "#quantityNotAvailable"
          );

          if (!increaseBtn || quantityNotAvailable) {
            alanBtnInstance.playCommand(
              "Functionality not available on this page"
            );
            return;
          }
          increaseBtn.click();
          alanBtnInstance.playText("Quantity increased.");
        } else if (commandData.command === "increaseBy") {
          const increaseBtn = document.querySelector("#increase");
          const quantityNotAvailable = document.querySelector(
            "#quantityNotAvailable"
          );

          if (!increaseBtn || quantityNotAvailable) {
            alanBtnInstance.playText(
              "Functionality not available on this page"
            );
            return;
          }
          const url = document.location.href.split("/");

          const foundProduct = homeData.products.find((product) =>
            product._id.toLowerCase().includes(url[url.length - 1])
          );

          const selectedQuantity = document.querySelector("#selectedQuantity");

          if (
            Number(selectedQuantity.textContent) + Number(commandData.title) >
            foundProduct.pQuantity
          ) {
            alanBtnInstance.playText(
              "Sorry! we don't have that much quantity in stock."
            );
            return;
          }
          console.log(Number(commandData.title), commandData.title);

          for (let i = 0; i < Number(commandData.title); i++) {
            setTimeout(() => increaseBtn.click(), 100);
          }

          alanBtnInstance.playText("Quantity increased.");
        } else if (commandData.command === "decreaseBy") {
          const decreaseBtn = document.querySelector("#decrease");
          const quantityNotAvailable = document.querySelector(
            "#quantityNotAvailable"
          );

          if (!decreaseBtn || quantityNotAvailable) {
            alanBtnInstance.playText(
              "Functionality not available on this page"
            );
            return;
          }

          const selectedQuantity = document.querySelector("#selectedQuantity");

          if (
            Math.abs(
              Number(commandData.title) - Number(selectedQuantity.textContent)
            ) < 1
          ) {
            alanBtnInstance.playText("Sorry! Minimum quantity is 1.");
            return;
          }
          console.log(Number(commandData.title), commandData.title);

          for (let i = 0; i < Number(commandData.title); i++) {
            setTimeout(() => decreaseBtn.click(), 100);
          }

          alanBtnInstance.playText("Quantity Decreased.");
        } else if (commandData.command === "decrease") {
          const decreaseBtn = document.querySelector("#decrease");
          const quantityNotAvailable = document.querySelector(
            "#quantityNotAvailable"
          );

          if (!decreaseBtn || quantityNotAvailable) {
            alanBtnInstance.playText(
              "Functionality not available on this page"
            );
            return;
          }
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

          alanBtnInstance.playText("price: " + price.innerText + " only!");
        } else if (commandData.command === "readPriceDescription") {
          const price = document.getElementById("productPrice");
          const description = document.getElementById("productDescription");
          if (!price || !description) {
            alanBtnInstance.playText(
              "Sorry! You are not viewing any product currently."
            );
            return;
          }

          alanBtnInstance.playText("price: " + price.innerText + " only!");
          alanBtnInstance.playText("Description: " + description.innerText);
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
        } else if (commandData.command === "checkout") {
          if (layoutData.cartTotalCost) {
            if (isAuthenticate()) {
              history.push("/checkout");

              setTimeout(() => {
                alanBtnInstance.playText(
                  "Please, fill out your details to proceed further."
                );
              }, 500);
            } else {
              alanBtnInstance.playText("Please, Login first.");
            }
          } else {
            alanBtnInstance.playText(
              "Your cart is empty. Please, add something in your cart.."
            );
          }
        } else if (commandData.command === "address") {
          const deliveryAddres = document.querySelector("#address");
          if (!deliveryAddres) {
            alanBtnInstance.playText(
              "You're currently not on the checkout page."
            );
            return;
          }

          deliveryAddres.focus();
          fireEvent.input(deliveryAddres, {
            target: {
              value: commandData.title.toLowerCase(),
            },
          });

          alanBtnInstance.playText(
            "Delivery Address Entered. Please, fill up rest of the details too."
          );
        } else if (commandData.command === "phone") {
          const phone = document.querySelector("#phone");
          if (!phone) {
            alanBtnInstance.playText(
              "You're currently not on the checkout page."
            );
            return;
          }

          // if (isNaN(commandData.title.toLowerCase())) {
          //   alanBtnInstance.playText("Only number are allowed in this field.");
          //   return;
          // }

          phone.focus();
          fireEvent.input(phone, {
            target: {
              value: Number(
                commandData.title.toLowerCase().replaceAll(" ", "")
              ),
            },
          });

          alanBtnInstance.playText(
            "Phone number Entered. Please, fill up rest of the details too."
          );
        } else if (commandData.command === "payByCard") {
          const cardContainer = document.querySelector(
            '.braintree-option[tabindex="0"]'
          );

          if (!cardContainer) {
            alanBtnInstance.playText(
              "You're currently not on the checkout page."
            );
            return;
          }

          cardContainer.click();

          alanBtnInstance.playText("Please, Enter your card details.");
        } else if (commandData.command === "ccNumber") {
          const ccNumber = document.querySelector("input#credit-card-number");
          console.log(ccNumber);
          if (!ccNumber) {
            alanBtnInstance.playText(
              "You're currently not on the checkout page. or you have not selected the payment method."
            );
            return;
          }

          if (isNaN(commandData.title.toLowerCase())) {
            alanBtnInstance.playText("Only number are allowed in this field.");
            return;
          }

          ccNumber.focus();
          fireEvent.input(ccNumber, {
            target: {
              value: Number(commandData.title.toLowerCase()),
            },
          });

          alanBtnInstance.playText(
            "Credit card number Entered. Please, fill up rest of the details too."
          );
        } else if (commandData.command === "expiryDate") {
          const expiryNumber = document.querySelector("#expiration");
          if (!expiryNumber) {
            alanBtnInstance.playText(
              "You're currently not on the checkout page. or you have not selected the payment method."
            );
            return;
          }

          if (isNaN(commandData.title.toLowerCase())) {
            alanBtnInstance.playText("Only number are allowed in this field.");
            return;
          }

          expiryNumber.focus();
          fireEvent.input(expiryNumber, {
            target: {
              value: Number(commandData.title.toLowerCase()),
            },
          });

          alanBtnInstance.playText("Expiry Date Entered.");
        } else if (commandData.command === "payNow") {
          const payNow = document.querySelector("#payNowBtn");
          if (!payNow) {
            alanBtnInstance.playText(
              "You're currently not on the checkout page."
            );
            return;
          }

          payNow.click();

          const error = document.querySelector("#checkoutError-true");

          if (error) {
            alanBtnInstance.playText("Error: " + error.textContent);
            return;
          }

          alanBtnInstance.playText("Thank you. Your order has been placed.");
        } else if (commandData.command === "switchLogin") {
          const switchBtn = document.querySelector("#switchLogin");

          if (!switchBtn) {
            alanBtnInstance.playText("Please open login & signup first.");
            return;
          }

          switchBtn.click();

          alanBtnInstance.playText("Switched");
        } else if (commandData.command === "typeName") {
          const nameEle = document.querySelector(".signup-name");
          if (!nameEle)
            alanBtnInstance.playText("Please open signup page first");

          fireEvent.input(nameEle, {
            target: { value: commandData.title.toLowerCase() },
          });

          alanBtnInstance.playText("Username entered.");
        } else if (commandData.command === "typeEmail") {
          const emailEle = document.getElementById("email");
          if (!emailEle) {
            alanBtnInstance.playText("Please open signup page first");
            return;
          }
          fireEvent.input(emailEle, {
            target: { value: commandData.title.toLowerCase() },
          });

          alanBtnInstance.playText("Email entered.");
        } else if (commandData.command === "typeSignupPassword") {
          const passwordEle = document.querySelector(".signup-password");
          const confirmPassEle = document.querySelector(
            ".signup-confirm-password"
          );

          if (!passwordEle || !confirmPassEle) {
            alanBtnInstance.playText("Please open signup page first");
            return;
          }

          passwordEle.focus();
          fireEvent.input(passwordEle, {
            target: {
              value: commandData.title.toLowerCase().replaceAll(" ", ""),
            },
          });

          confirmPassEle.focus();
          fireEvent.input(confirmPassEle, {
            target: {
              value: commandData.title.toLowerCase().replaceAll(" ", ""),
            },
          });

          alanBtnInstance.playText("Password entered, initiating sign up.");

          document.getElementById("signupBtn").click();

          setTimeout(() => {
            const signupErrors = document.querySelectorAll("#signupErrors");

            if (signupErrors?.length) {
              signupErrors?.forEach((error) => {
                alanBtnInstance.playText(error.textContent);
              });

              return;
            } else {
              alanBtnInstance.playText("sign up successful.");
            }
          }, 500);
        } else if (commandData.command === "showOrderStaus") {
          history.push("/user/orders");
        } else if (commandData.command === "readOrderStatus") {
          setTimeout(() => {
            const allProducts = document.querySelectorAll("#userProductName");
            console.log(allProducts);

            if (allProducts.length === 0) {
              alanBtnInstance.playText("You don't have any orders currently.");
              return;
            }

            const totalOrders = document.querySelector("#totalOrders");

            let readOutText = `You have ${totalOrders.textContent} orders. `;

            allProducts.forEach((product) => {
              readOutText += " Your status for order containing ";
              [...product.children].forEach((child) => {
                readOutText += child.children[1].textContent + " ";
              });

              readOutText += " is ";

              readOutText +=
                product.parentNode.children[1].textContent + ".      ";
            });

            alanBtnInstance.playText(readOutText);
          }, 1000);
        }
      },
    });
  }, [history, homeData.loading, homeData.products, layoutData?.cartTotalCost]);

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
  const [dashboardData, dashboardDispatch] = useReducer(
    dashboardUserReducer,
    dashboardUserState
  );
  return (
    <Fragment>
      <DashboardUserContext.Provider
        value={{ dashboardData, dashboardDispatch }}
      >
        <HomeContext.Provider value={{ data, dispatch }}>
          <Layout children={<HomeComponent />} />
        </HomeContext.Provider>
      </DashboardUserContext.Provider>
    </Fragment>
  );
};

export default Home;
