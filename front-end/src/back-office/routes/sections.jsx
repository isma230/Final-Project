import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";
import { useEffect } from "react";
import { useRouter } from "../routes/hooks";

import DashboardLayout from "../layouts/dashboard";

export const IndexPage = lazy(() => import("../pages/app"));
export const BlogPage = lazy(() => import("../pages/blog"));
export const UserPage = lazy(() => import("../pages/user"));
export const LoginPage = lazy(() => import("../pages/login"));
export const ProductsPage = lazy(() => import("../pages/products"));
export const Page404 = lazy(() => import("../pages/page-not-found"));
export const AddUserPage = lazy(() => import("../pages/addUser"));
export const EditUserPage = lazy(() => import("../pages/editUser"));
export const CustomerPage = lazy(() => import("../pages/customer"));
export const EditCustomerPage = lazy(() => import("../pages/editCustomer"));
export const TransactionList = lazy(() => import("../pages/paymentPage"));
export const CategoryPage = lazy(() => import("../pages/category"));
export const EditCategoryPage = lazy(() => import("../pages/editCategory"));
export const AddCategoryPage = lazy(() => import("../pages/addCategory"));
export const SubCategoryPage = lazy(() => import("../pages/subcategory"));
export const AddSubCategoryPage = lazy(() => import("../pages/addSubCategory"));
export const EditSubCategoryPage = lazy(() => import("../pages/editSubCategory"));
export const AddProductPage = lazy(() => import('../pages/addProduct'));
export const EditProductPage = lazy(() => import('../pages/editProduct'));
export const OrderPage = lazy(() => import('../pages/orders'));
export const EditOrderPage = lazy(() => import('../pages/editOrder')); 
// ----------------------------------------------------------------------
// Higher Order Component for Protected Routes
const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user) {
      router.push("/back-office/login");
    }
  }, [user]);

  return children;
};
export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <ProtectedRoute>
          <Suspense>
            <Outlet />
          </Suspense>
          </ProtectedRoute>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        {
          path: "/user",
          element: <UserPage />,
        },
        {
          path: "user/adduser",
          element: <AddUserPage />,
        },
        {
          path: 'user/edituser',
          element: <EditUserPage />,
        },       
        {
          path: 'products',
          element: <ProductsPage />,
        },
        {
          path: 'products/addproduct',
          element: <AddProductPage />,
        },
        {
          path: 'products/editproduct/:id',
          element: <EditProductPage />,
        },
        {
          path: "customer",
          element: <CustomerPage />,
        },
        {
          path: "category",
          element: <CategoryPage />,
        },
        {
          path: "category/addcategory",
          element: <AddCategoryPage />,
        },
        {
          path: "subcategory",
          element: <SubCategoryPage />,
        },
        {
          path: "subcategory/addsubcategory",
          element: <AddSubCategoryPage />,
        },
        {
          path: "subcategory/addsubcategory",
          element: <AddCategoryPage />,
        },
        {
          path: "orders",
          element: <OrderPage />,
        },
      ],
    },
    {
      path: "user/edituser/:id",
      element: <EditUserPage />,
    },
    {
      path: "customer/editcustomer/:id",
      element: <EditCustomerPage />,
    },
    {
      path: "category/editcategory/:id",
      element: <EditCategoryPage />,
    },
    {
      path: "subcategory/editsubcategory/:id",
      element: <EditSubCategoryPage />,
    },
    {
      path: "orders/editorder/:id",
      element: <EditOrderPage />,
    },
    {
      path: "payment",
      element: <TransactionList />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
    // {
    //   path: "*",
    //   element: <Navigate to="/404" replace />,
    // },
  ]);

  return routes;
}
