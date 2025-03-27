import apiClient from "./apiClient";

// Fetch leads with pagination, filtering, and sorting
export const fetchLeads = async ({ skip, limit, search, sortBy, sortOrder, filters }) => {
  const params = {
    skip,
    limit,
    sort_by: sortBy,
    sort_order: sortOrder,
    ...(filters && { filters: JSON.stringify(filters) }),
  };

  if (search) {
    params.search = search;
  }

  const response = await apiClient.get("/leads/leads", { params });
  return response.data;
};


// Create a new lead
export const createLead = async (leadData) => {
  const response = await apiClient.post("/leads/", leadData);
  return response.data;
};

// Update a lead (note: using /leads/id/:id route)
export const updateLead = async (id, leadData) => {
  const response = await apiClient.put(`/leads/id/${id}`, leadData);
  return response.data;
};

// Delete a lead
export const deleteLead = async (id) => {
  await apiClient.delete(`/leads/id/${id}`);
};

// Export leads as CSV (returns a Blob)
export const exportLeads = async () => {
  const response = await apiClient.get("/leads/export-leads", {
    responseType: "blob",
  });
  return response.data;
};