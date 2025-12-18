import Feedpage from "@/components/FeedPage";
import Header from "@/components/Layouts/Header";
import Sidebar from "@/components/Layouts/Sidebar";
import ProfilePage from "@/components/ProfilePage/Index";

const Index = () => {
  return (
    <div className="moneyboy-layout-container">
      <Header />
      <div className="container">
        <div className="moneyboy-main-asides-layout-container">
          <Sidebar />
          <div className="moneyboy-page-content-container">
            <main className="moneyboy-dynamic-content-layout">
              <Feedpage />;
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
