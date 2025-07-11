import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Profile from "../pages/Profile";
import MyPost from "../pages/MyPost";
import AddPost from "../pages/AddPost";
import UserSideBar from "../layouts/UserSideBar";
import TaskManager from "../pages/TaskManager";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddProduct from "../pages/AddProduct";
import AdminSideBar from "../layouts/AdminSideBar";
import NotFound from "../pages/NotFound";
import Setting from "../pages/Setting";
import Users from "../pages/dashboard/Users";
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/dashboard/Analytics";
import Post from "../pages/Post";
import MyProduct from "../pages/MyProduct";
import PublicRoute from "../layouts/PublicRoute";
import Product from "../pages/Product";
import Subscription from "../pages/Subscription";
import Assignments from "../pages/Assignments";
import Polls from "../pages/Polls";
import Resources from "../pages/Resources";
import Tests from "../pages/Tests";
import TaskDetails from "../pages/TaskDetails";
import AddAssignment from "../pages/AddAssignment";
import AddPoll from "../pages/AddPoll";
import AddTest from "../pages/AddTest";
import TakeTest from "../pages/TakeTest";
import TestDetails from "../pages/TestDetails";
import EditTest from "../pages/EditTest";
import ViewSubmissions from "../pages/ViewSubmissions";
import Posts from "../pages/Posts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/profile",
    element: (
      <UserSideBar>
        <Profile />
      </UserSideBar>
    ),
  },
  {
    path: "/my-post",
    element: (
      <UserSideBar>
        <MyPost />
      </UserSideBar>
    ),
  },
  {
    path: "/add-post",
    element: (
      <UserSideBar>
        <AddPost />
      </UserSideBar>
    ),
  },
  {
    path: "/task-management",
    element: (
      <>
        <UserSideBar>
          <DndProvider backend={HTML5Backend}>
            <TaskManager />
          </DndProvider>
        </UserSideBar>
      </>
    ),
  },
  {
    path: "/add-product",
    element: (
      <UserSideBar>
        <AddProduct />
      </UserSideBar>
    ),
  },
  {
    path: "/my-product",
    element: (
      <UserSideBar>
        <MyProduct />
      </UserSideBar>
    ),
  },
  {
    path: "/setting",
    element: (
      <UserSideBar>
        <Setting />
      </UserSideBar>
    ),
  },
  {
    path: "/assignments",
    element: (
      <UserSideBar>
        <Assignments />
      </UserSideBar>
    ),
  },
  {
    path: "/add-assignment",
    element: (
      <UserSideBar>
        <AddAssignment />
      </UserSideBar>
    ),
  },
  {
    path: "/add-poll",
    element: (
      <UserSideBar>
        <AddPoll />
      </UserSideBar>
    ),
  },
  {
    path: "/polls",
    element: (
      <UserSideBar>
        <Polls />
      </UserSideBar>
    ),
  },
  {
    path: "/posts",
    element: (
      <UserSideBar>
        <Posts />
      </UserSideBar>
    ),
  },
  {
    path: "/resources",
    element: (
      <UserSideBar>
        <Resources />
      </UserSideBar>
    ),
  },
  {
    path: "/tests",
    element: (
      <UserSideBar>
        <Tests />
      </UserSideBar>
    ),
  },
  {
    path: "/add-test",
    element: (
      <UserSideBar>
        <AddTest />
      </UserSideBar>
    ),
  },
  {
    path: "/tests/:testId",
    element: (
      <UserSideBar>
        <TestDetails />
      </UserSideBar>
    ),
  },
  {
    path: "/tests/:testId/take",
    element: (
      <UserSideBar>
        <TakeTest />
      </UserSideBar>
    ),
  },
  {
    path: "/tests/:testId/edit",
    element: (
      <UserSideBar>
        <EditTest />
      </UserSideBar>
    ),
  },
  {
    path: "/tests/:testId/submissions",
    element: (
      <UserSideBar>
        <ViewSubmissions />
      </UserSideBar>
    ),
  },
  {
    path: "/tasks/:taskId",
    element: (
      <UserSideBar>
        <TaskDetails />
      </UserSideBar>
    ),
  },
  {
    path: "/posts/:postId",
    element: (
      <PublicRoute>
        <Post />
      </PublicRoute>
    ),
  },
  {
    path: "/products/:productId",
    element: (
      <PublicRoute>
        <Product />
      </PublicRoute>
    ),
  },
  {
    path: "/subscription",
    element: (
      <PublicRoute>
        <Subscription />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: <AdminSideBar />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
