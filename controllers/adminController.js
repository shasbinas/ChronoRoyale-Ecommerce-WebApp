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


// Admin logout 
export const adminLogout = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.log("Error destroying session:", err);
        return res.redirect("/admin/dashboard"); // fallback
      }
      res.clearCookie("connect.sid"); // optional: clear session cookie
      res.redirect("/admin");          // redirect to login page
    });
  } else {
    res.redirect("/admin"); // if no session exists
  }
};



