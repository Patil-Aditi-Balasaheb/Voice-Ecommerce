import React, { useEffect } from 'react'
import alanBtn from '@alan-ai/alan-sdk-web';
import { useHistory } from "react-router-dom";
import { useRef } from "react";
import { LayoutContext } from "../index";
import { HomeContext } from './index';
import { useContext } from 'react';

const Alan = () => {
	const categoryRef = useRef(null);
	const history = useHistory();
	const { dispatch: layoutDispatch } = useContext(LayoutContext);
	const { data: homeData, dispatch: homeDispatch } = useContext(HomeContext);

	useEffect(() => {
		console.log(homeData);
		

		function sendCategory() {
			alanBtnInstance.activate();

			// Calling the project API method on button click
			alanBtnInstance.callProjectApi("listCategories", {
				categories: 'Electronics, Fashion, Home and Garden, Sports, Health and Beauty, Collectibles and Art Products',
			}, function (error, result) { });
		};

		var alanBtnInstance = alanBtn({
			//key: 'd22e60a51299e6155cfe9d61365910e42e956eca572e1d8b807a3e2338fdd0dc/stage',
			key: '5e3df0d79bb4f3b6741d7acd6b2bfb412e956eca572e1d8b807a3e2338fdd0dc/stage',
			onCommand: (commandData) => {
				if (commandData.command === 'showCart') {
					// Navber.cartModalOpen();
					layoutDispatch({ type: "cartModalToggle", payload: true });
				}
				else if (commandData.command === 'closeCart') {
					layoutDispatch({ type: "cartModalToggle", payload: false });

				}
				else if (commandData.command === 'showProduct') {
					// alanBtnInstance.playText(commandData.title);


						const foundProduct = homeData.products.find((product) => (product.pName.toLowerCase().search(commandData.title.toLowerCase())));

						if (foundProduct) {
							history.push("/products/" + foundProduct._id);
							alanBtnInstance.playText("Sure, Showing " + foundProduct.pName);
						};

						if (!foundProduct) alanBtnInstance.playText("product not available or incorrect product name");

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
				else if (commandData.command === 'ListCategories') {
					sendCategory();
					history.push("/");
					homeDispatch({
						type: "categoryListDropdown",
						payload: !homeData.categoryListDropdown,
					});

					categoryRef.current?.scrollIntoView({
						behavior: "smooth",
						block: "center"
					});
				}
				else if (commandData.command === 'Electronics') {
					history.push("/products/category/634b130eb5966b04d490e0a5");
				}
				else if (commandData.command === 'Fashion') {
					history.push("/products/category/634b149ab5966b04d490e0c8");
				}
				else if (commandData.command === 'HomenGarden') {
					history.push("/products/category/634b15d2b5966b04d490e0cc");
				}
				else if (commandData.command === 'Sports') {
					history.push("/products/category/635216b8fea69c47a46fc014");
				}
				else if (commandData.command === 'HealthnBeauty') {
					history.push("/products/category/6352175afea69c47a46fc02f");
				}
				else if (commandData.command === 'Collectibles') {
					history.push("/products/category/63521846fea69c47a46fc055");
				} else if (commandData.command === 'Login') {
					layoutDispatch({ type: "loginSignupModalToggle", payload: true });
				}
				else if (commandData.command === 'closeLogin') {
					layoutDispatch({ type: "loginSignupModalToggle", payload: false });
				}
			}
		});

		return ()=>{
			alanBtnInstance.deactivate()
			alanBtnInstance.remove();
		}
	}, [history]);

	return (
		<>
		</>
	)
}

export default Alan
