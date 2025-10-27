import { BrowserRouter as Router } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AttorneyRoutes from "./routes/AttorneyRoutes";

function AppContent() {
  if (true) return <PublicRoutes />;

  // switch () {
  //   case "admin":
  //     break;
  //   case "attorney":
  //     break;
  //   case "admin":
  //     break;

  //   default:
  //     break;
  // }

  if (true) {
    return <AdminRoutes />;
  } else if (false) {
    return <AttorneyRoutes />;
  }
}

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </>
  );
}
