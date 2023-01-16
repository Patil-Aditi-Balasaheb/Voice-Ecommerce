import React, { Fragment, createContext, useReducer } from "react";
import Layout from "../layout";
import Slider from "./Slider";
import ProductCategory from "./ProductCategory";
import { homeState, homeReducer } from "./HomeContext";
import SingleProduct from "./SingleProduct";
import alanBtn from '@alan-ai/alan-sdk-web';
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

export const HomeContext = createContext();

const HomeComponent = () => {

  const history = useHistory();

  useEffect(() => {
    function sendCategory() {
      alanBtnInstance.activate();
      // Calling the project API method on button click
      alanBtnInstance.callProjectApi("listCategories", {
        categories: 'Electronics, Fashion, Home and Garden, Sports, Health and Beauty, Collectibles and Art Products',
      }, function(error, result) {});
    };
    
    var alanBtnInstance = alanBtn({
      //key: 'd22e60a51299e6155cfe9d61365910e42e956eca572e1d8b807a3e2338fdd0dc/stage',
      key: '8a0d8107f8d57720e65cb7dbd8f921da2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: (commandData) => {
        if (commandData.command === 'Cart') {
          // Navber.cartModalOpen();
        }
        else if (commandData.command === "Wishlist") {
          history.push("/wish-list");
        }
        else if (commandData.command === "UserProfile") {
          history.push("/user/profile");
        }
        else if (commandData.command === "UserOrders") {
          history.push("/user/orders");
        }
        else if (commandData.command === "SettingUser") {
          history.push("/user/setting");
        }
        else if (commandData.command === "Home") {
          history.push("/");
        }
        else if (commandData.command === "ContactUs") {
          history.push("/contact-us");
        }
        else if (commandData.command === 'DashboardAdmin') {
          history.push("/admin/dashboard");
        }
        else if (commandData.command === 'Categories') {
          history.push("/admin/dashboard/categories")
        }
        else if (commandData.command === 'Products') {
          history.push("/admin/dashboard/products")
        }
        else if (commandData.command === 'Orders') {
          history.push("/admin/dashboard/orders")
        }
        else if(commandData.command === 'ListCategories') {
          sendCategory();
        }
        else if(commandData.command === 'Electronics') {
          history.push("/products/category/634b130eb5966b04d490e0a5");
        }
        else if(commandData.command === 'Fashion') {
          history.push("/products/category/634b149ab5966b04d490e0c8");
        }
        else if(commandData.command === 'HomenGarden') {
          history.push("/products/category/634b15d2b5966b04d490e0cc");
        }
        else if(commandData.command === 'Sports') {
          history.push("/products/category/635216b8fea69c47a46fc014");
        }
        else if(commandData.command === 'HealthnBeauty') {
          history.push("/products/category/6352175afea69c47a46fc02f");
        }
        else if(commandData.command === 'Collectibles') {
          history.push("/products/category/63521846fea69c47a46fc055");
        }
      }
    });
  }, [history]);

  return (
    <Fragment>
      <Slider />
      {/* Category, Search & Filter Section */}
      <section className="m-4 md:mx-8 md:my-6">
        <ProductCategory />
      </section>
      {/* Product Section */}
      <section className="m-4 md:mx-8 md:my-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <SingleProduct />
      </section>
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
