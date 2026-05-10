const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8788/api' 
  : 'https://smart-gate-backend.pulpbit.workers.dev/api';

const API = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'index.html';
      throw new Error('Unauthorized');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  },

  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  async getUsers() {
    return this.request('/users');
  },

  async createUser(user) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  },

  async createMaterialInward(data) {
    return this.request('/material/inward', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getMaterialInward() {
    return this.request('/material/inward');
  },

  async createMaterialOutward(data) {
    return this.request('/material/outward', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getMaterialOutward() {
    return this.request('/material/outward');
  },

  async createVendorEntry(data) {
    return this.request('/vendor/entry', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getVendors() {
    return this.request('/vendor');
  },

  async vendorExit(id) {
    return this.request(`/vendor/exit/${id}`, {
      method: 'POST'
    });
  },

  async createVehicleEntry(data) {
    return this.request('/vehicle/entry', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getVehicles() {
    return this.request('/vehicle');
  },

  async vehicleExit(id) {
    return this.request(`/vehicle/exit/${id}`, {
      method: 'POST'
    });
  }
};
