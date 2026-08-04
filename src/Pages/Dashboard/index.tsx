import UIBreadcrumb from "@/UI/Elements/Breadcrumb";
import UILayout from "@/UI/Elements/Layout";
import Chart1 from "./chart1";

const Dashboard = () => {
  const breadcrumb = [
    { name: "home", path: "/", color: true },
    {
      name: "dashboard",
      url: "#",
      color: false,
    },
  ];

  return (
    <UILayout>
      <div className="p-6">
        <UIBreadcrumb breadcrumbs={breadcrumb} />
        <div className="text-2xl font-bold  pb-1 pt-5">
          <h1 className="pl-5 text-3xl font-semibold p-2">{"dashboard"}</h1>
        </div>
        <div className="text-2xl font-bold  pb-1 pt-5">
              <Chart1 />
        </div>
      </div>
    </UILayout>
  );
};

export default Dashboard;
