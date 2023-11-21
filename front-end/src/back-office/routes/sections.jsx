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

// ----------------------------------------------------------------------
// Higher Order Component for Protected Routes
const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user) {
      router.push("/login");
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
          path: "user",
          element: <UserPage />,
        },
        {
          path: "user/adduser",
          element: <AddUserPage />,
        },
        {
          path: "products",
          element: <ProductsPage />,
          children: [
            { path: "addproduct", element: <ProductsPage /> },
            { path: "editproduct", element: <ProductsPage /> },
          ],
        },
        {
          path: "customer",
          element: <BlogPage />,
          children: [{ path: "editcustomer", element: <BlogPage /> }],
        },
        {
          path: "orders",
          element: <BlogPage />,
        },
      ],
    },
    {
      path: "user/edituser/:id",
      element: <EditUserPage />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
