export const fetchHomeData = async (userId, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const [alertsRes, farmsRes, tasksRes] = await Promise.all([
      fetch("http://localhost:3000/alert/with_info", { headers }),
      fetch(`http://localhost:3000/farms/user/${userId}`, { headers }),
      fetch("http://localhost:3000/task", { headers }),
    ]);

    const alertsData = await alertsRes.json();
    const farmsData = await farmsRes.json();
    const tasksData = await tasksRes.json();

    const myTasks = tasksData.filter(
      (task) => task.assigned_to === userId
    );

    return { alerts: alertsData, farms: farmsData, myTasks };
  } catch (err) {
    console.error("Error fetching home data:", err);
    throw err;
  }
};
