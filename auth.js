let auth0 = null;

const config = {
  domain: "dev-dahew75c5wgx2lvi.us.auth0.com",
  clientId: "DM3do1sICM0fzHKwTEjJJti393cRJG4h",
  redirectUri: "https://college-laptop-guide.vercel.app/"
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: config.redirectUri
  });
};

const logout = () => {
  auth0.logout({
    returnTo: config.redirectUri
  });
};

const initAuth0 = async () => {
  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId
  });

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  const isAuthenticated = await auth0.isAuthenticated();
  document.getElementById("login").style.display = isAuthenticated ? "none" : "inline-block";
  document.getElementById("logout").style.display = isAuthenticated ? "inline-block" : "none";

  if (isAuthenticated) {
    const user = await auth0.getUser();
    console.log("Logged in as", user.name);
  }
};

window.onload = () => {
  initAuth0();
  document.getElementById("login").addEventListener("click", login);
  document.getElementById("logout").addEventListener("click", logout);
};
