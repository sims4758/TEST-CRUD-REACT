const API_URL = "http://localhost:3000";

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();
    if (response.ok) {
      setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    } else {
      clearTokens();
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    clearTokens();
    return null;
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  let token = getAccessToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // ถ้า Token หมดอายุ ให้รีเฟรช Token และเรียก API ใหม่
  if (response.status === 401) {
    token = await refreshAccessToken();
    if (token) {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return response;
};

export const getProfile = async () => {
  try {
    const response = await fetchWithAuth(`${API_URL}/users/profile`);
    if (response.ok) {
      const data = await response.json();
      //   setUser({ username: data.username });
      return data;
    } else {
      clearTokens();
    }
  } catch (error) {
    console.log("Error getting profile:", error);

    clearTokens();
  }
};

export const authToken = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.access_token);
      console.log(data.refresh_token);

      setTokens(data.access_token, data.refresh_token);
      const result = await getProfile();
      return result;
    } else {
      console.error("Login failed:", response.status);
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
};
