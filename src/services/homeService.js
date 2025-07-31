export const fetchHomeData = async (userId, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const [alertsRes, farmsRes] = await Promise.all([
      fetch("http://localhost:3000/alert/with_info", { headers }),
      fetch(`http://localhost:3000/farms/user/${userId}`, { headers }),
    ]);

    const alertsData = await alertsRes.json();
    const farmsData = await farmsRes.json();

    return { alerts: alertsData, farms: farmsData };
  } catch (err) {
    console.error("Error fetching home data:", err);
    throw err;
  }
};
