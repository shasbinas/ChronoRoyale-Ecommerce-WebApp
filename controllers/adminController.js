export const adminLoginPage = async (req, res) => {
  console.log("Admin dashboard route working 🚀");
  //   res.status(200).json({ message: "Admin dashboard route working 🚀" });

  res.render("admin/adminLogin", { layout: "admin", title: "Admin Login" });
};

export const adminDashboardPage = async (req, res) => {
  console.log("Admin dashboard route working 🚀");
  //   res.status(200).json({ message: "Admin dashboard route working 🚀" });

  res.render("admin/dashboard", { layout: "admin", title: "Admin Dashboard" });
};


export const adminUsersListPage = async (req, res) => {
  console.log("Admin users list route working 🚀");
  //   res.status(200).json({ message: "Admin dashboard route working 🚀" });

  res.render("admin/users-list", { layout: "admin", title: "Admin - Users List" });
};


