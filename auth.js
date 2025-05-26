let auth0 = null;

const config = {
  domain: "dev-dahew75c5wgx2lvi.us.auth0.com",
  clientId: "DM3do1sICM0fzHKwTEjJJti393cRJG4h",
  redirectUri: "https://college-laptop-guide-1sxe4w1zl-avishmaniar21s-projects.vercel.app/callback"

};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: config.redirectUri
  });
};

const logout = () => {
  auth0.logout({
    returnTo: window.location.origin
  });
};

const initAuth0 = async () => {
  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId
  });

  // Handle redirect after login
  if (window.location.pathname === "/callback" &&
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  const isAuthenticated = await auth0.isAuthenticated();

  // Toggle login/logout buttons
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  if (loginBtn && logoutBtn) {
    loginBtn.style.display = isAuthenticated ? "none" : "inline-block";
    logoutBtn.style.display = isAuthenticated ? "inline-block" : "none";
  }

  // Show user profile if logged in
  if (isAuthenticated) {
    const user = await auth0.getUser();
    const main = document.querySelector("main");
    main.innerHTML = `
      <h2>Welcome, ${user.name.toUpperCase()}!</h2>
      <img src="${user.picture}" alt="${user.name}" style="border-radius: 50%; width: 80px;">
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
    `;
  }
};

window.onload = () => {
  initAuth0();
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");

  if (loginBtn) loginBtn.addEventListener("click", login);
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
};
