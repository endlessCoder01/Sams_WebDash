import Swal from "sweetalert2";

export const logout = (navigate, setIsAuthenticated, setRole) => {
  try {
    localStorage.clear();

    if (setIsAuthenticated) setIsAuthenticated(false);
    if (setRole) setRole(null);

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been successfully logged out.",
      confirmButtonColor: "#6B6F1D",
    }).then(() => {
      navigate("/");
    });
  } catch (err) {
    console.error("Logout failed:", err);
    Swal.fire("Oops!", "Something went wrong while logging out.", "error");
  }
};
