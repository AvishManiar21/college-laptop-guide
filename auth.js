let auth0 = null;

const config = {
  domain: "dev-dahew75c5wgx2lvi.us.auth0.com",
  clientId: "DM3do1sICM0fzHKwTEjJJti393cRJG4h",
  redirectUri: window.location.origin,
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: config.redirectUri,
  });
};

const logout = () => {
  auth0.logout({
    returnTo: config.redirectUri,
  });
};

const initAuth = async () => {
  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
  });

  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  const isAuthenticated = await auth0.isAuthenticated();

  document.getElementById("login").style.display = isAuthenticated ? "none" : "inline-block";
  document.getElementById("logout").style.display = isAuthenticated ? "inline-block" : "none";

  if (!isAuthenticated) {
    login(); // Force login for protected pages
    return;
  }

  const user = await auth0.getUser();
  const name = document.getElementById("user-name");
  const email = document.getElementById("user-email");
  const picture = document.getElementById("user-picture");
  const profile = document.getElementById("user-profile");
  const welcome = document.getElementById("welcome-section");

  if (name && email && picture && profile && welcome) {
    name.innerText = user.name;
    email.innerText = user.email;
    picture.src = user.picture;
    profile.style.display = "block";
    welcome.style.display = "block";
  }
};

window.onload = () => {
  initAuth();
  document.getElementById("login").addEventListener("click", login);
  document.getElementById("logout").addEventListener("click", logout);
};
