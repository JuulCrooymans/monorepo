import Navbar from "./Navbar";
import DashboardNavbar from "./DashboardNavbar";
import SettingsSidebar from "./SettingsSidebar";

interface LayoutProps {
  children: React.ReactElement;
}

interface AuthenticateLayout extends LayoutProps {}

interface DashboardLayout extends LayoutProps {}

interface SettingsLayout extends LayoutProps {}

interface WebLayout extends LayoutProps {}

function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}

Layout.Authenticate = ({ children }: AuthenticateLayout) => {
  return <div className="sm:w-96 mx-auto px-4 sm:px-0">{children}</div>;
};

Layout.Dashboard = ({ children }: DashboardLayout) => {
  return (
    <div>
      <DashboardNavbar />
      <div className="px-4">{children}</div>
    </div>
  );
};

Layout.Settings = ({ children }: SettingsLayout) => {
  return (
    <div>
      <DashboardNavbar />
      <div className="lg:grid lg:grid-cols-10 max-w-7xl mx-auto gap-x-8 lg:pl-2 pl-4 pr-4">
        <div className="lg:col-span-2">
          <SettingsSidebar />
        </div>
        <div className="w-full xl:col-span-6 lg:col-span-8">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

Layout.Web = ({ children }: WebLayout) => {
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
