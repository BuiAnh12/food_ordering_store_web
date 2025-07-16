const USER_ID_KEY = 'userId';
const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';
const STORE_ID_KEY = 'storeId';
const STORE_KEY = 'store';

const localStorageService = {
  // Setters
  setUserId: (userId) => {
    localStorage.setItem(USER_ID_KEY, JSON.stringify(userId));
  },
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  },
  setRole: (role) => {
    localStorage.setItem(ROLE_KEY, JSON.stringify(role));
  },
  setStoreId: (storeId) => {
    localStorage.setItem(STORE_ID_KEY, JSON.stringify(storeId));
  },
  setStore: (store) => {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  },

  // Getters
  getUserId: () => {
    const val = localStorage.getItem(USER_ID_KEY);
    return val ? JSON.parse(val) : null;
  },
  getToken: () => {
    const val = localStorage.getItem(TOKEN_KEY);
    return val ? JSON.parse(val) : null;
  },
  getRole: () => {
    const val = localStorage.getItem(ROLE_KEY);
    return val ? JSON.parse(val) : null;
  },
  getStoreId: () => {
    const val = localStorage.getItem(STORE_ID_KEY);
    return val ? JSON.parse(val) : null;
  },
  getStore: () => {
    const val = localStorage.getItem(STORE_KEY);
    return val ? JSON.parse(val) : null;
  },

  // Clear All (for logout, etc.)
  clearAll: () => {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(STORE_ID_KEY);
    localStorage.removeItem(STORE_KEY);
  }
};

export default localStorageService;
