export const fetchDepartments = async () => {
  try {
    const response = await axios.get("http://https://employee-backend-q7hn.onrender.com/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error || "Error fetching departments");
    }
  }
};
