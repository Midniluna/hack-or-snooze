"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

// Handle user login event
async function login(evt) {
	console.debug("login", evt);
	evt.preventDefault();

	const username = $("#login-username").val();
	const password = $("#login-password").val();

	// sets gobal user to User instance, saving login info to the localstorage
	// if failed, alert user
	let res;
	try {
		res = currentUser = await User.login(username, password);

		saveUserCredentialsInLocalStorage();
		updateUIOnUserLogin();
		$faileLogin.hide();
	} catch (error) {
		console.log("We are getting this error:", error);
		$failedLogin.show();
		$failedUser.hide();
	}

	$loginForm.trigger("reset");
}

$loginForm.on("submit", login);

// Handle signup event
async function signup(evt) {
	console.debug("signup", evt);
	evt.preventDefault();

	const name = $("#signup-name").val();
	const username = $("#signup-username").val();
	const password = $("#signup-password").val();

	// sends user info to API and creates new user with that info.
	// If failed, alert user
	let res;
	try {
		res = await User.signup(username, password, name);
		saveUserCredentialsInLocalStorage();
		updateUIOnUserLogin();
		$failedUser.hide();
		// Catch error and change message based on specific error
	} catch (error) {
		if (username === "") {
			$failedUser.children("span")[0].innerText =
				"Please enter a valid username!";
			$failedUser.show();
		} else {
			$failedUser.children("span")[0].innerText = "Username already taken!";
			$failedUser.show();
		}
		$failedLogin.hide();
	}

	$signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

// Log user out and clear saved info from localstorage
function logout(evt) {
	console.debug("logout", evt);
	localStorage.clear();
	location.reload();
}

$navLogOut.on("click", logout);

// checking if user exists in local storage, if so, log user in
async function checkForRememberedUser() {
	console.debug("checkForRememberedUser");
	const token = localStorage.getItem("token");
	const username = localStorage.getItem("username");
	if (!token || !username) return false;

	// try to log in with these credentials (will be null if login failed)
	currentUser = await User.loginViaStoredCredentials(token, username);
}

// save user info to local storage
function saveUserCredentialsInLocalStorage() {
	console.debug("saveUserCredentialsInLocalStorage");
	if (currentUser) {
		localStorage.setItem("token", currentUser.loginToken);
		localStorage.setItem("username", currentUser.username);
	}
}

// Refresh page to show stories on home page, show navigation links
function updateUIOnUserLogin() {
	console.debug("updateUIOnUserLogin");

	hidePageComponents();

	$allStoriesList.show();

	updateNavOnLogin();
}
