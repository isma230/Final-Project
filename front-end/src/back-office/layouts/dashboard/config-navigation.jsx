import SvgColor from "../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "dashboard",
    path: "/back-office",
    icon: icon("ic_analytics"),
  },
  {
    title: "user",
    path: "/back-office/user",
    icon: icon("ic_user"),
    subitems: [{ title: "Add New User", path: "/back-office/user/adduser" }],
  },
  {
    title: "Customer",
    path: "/back-office/customer",
    icon: icon("ic_user"),
  },
  {
    title: "Category",
    path: "/back-office/category",
    icon: icon("ic_category"),
    subitems: [
      { title: "Add New Category", path: "/back-office/category/addcategory" },
    ],
  },
  {
    title: "SubCategory",
    path: "/back-office/subcategory",
    icon: icon("ic_subcat"),
    subitems: [
      { title: "Add New SubCategory", path: "/back-office/subcategory/addsubcategory" },
    ],
  },
  {
    title: "product",
    path: "/back-office/products",
    icon: icon("ic_product"),
    subitems: [
      { title: "Add New Product", path: "/back-office/products/addproduct" },
    ],
  },
  {
    title: "order",
    path: "/back-office/orders",
    icon: icon("ic_cart"),
  },
  // {
  //   title: "login",
  //   path: "/back-office/login",
  //   icon: icon("ic_lock"),
  // },
  // {
  //   title: "Not found",
  //   path: "/back-office/404",
  //   icon: icon("ic_disabled"),
  // },
];

export default navConfig;
