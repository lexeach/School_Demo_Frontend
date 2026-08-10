import UIBreadcrumb from "@/UI/Elements/Breadcrumb";
import UILayout from "@/UI/Elements/Layout";
import Chart1 from "./chart1";
import { Upload, Download } from "lucide-react";
import { useDispatch } from "react-redux";
import { setFormOpen } from "@/slice/layoutSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const breadcrumb = [
    {
      name: "home",
      path: "/",
      color: true,
    },
    {
      name: "dashboard",
      url: "#",
      color: false,
    },
  ];

  /**
   * Download Excel template for bulk user upload
   *
   * One row = one User + one Child
   *
   * Required columns:
   * name
   * email
   * mobile
   * password
   * childName
   * childAge
   * childGrade
   * subject
   */
  const downloadUserTemplate = () => {
    const headers =
      "name,email,mobile,password,childName,childAge,childGrade,subject";

    const example =
      "Rahul Sharma,rahul@gmail.com,9876543210,Rahul@123,Aarav Sharma,10,5th Grade,Mathematics";

    const csvContent = `${headers}\n${example}`;

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk-user-upload-template.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /**
   * Open the Bulk User Upload sheet.
   *
   * This uses the same Redux sheet mechanism already used by
   * the Users / Children / Subject / Syllabus pages.
   */
  const handleBulkUpload = () => {
    dispatch(
      setFormOpen({
        sheetComponent: "bulkUploadUsers",
        style: "h-[95%] p-0",
      })
    );
  };

  return (
    <UILayout>
      <div className="p-6">
        <UIBreadcrumb breadcrumbs={breadcrumb} />

        <div className="text-2xl font-bold pb-1 pt-5">
          <h1 className="pl-5 text-3xl font-semibold p-2">
            Dashboard
          </h1>
        </div>

        {/* Existing Dashboard Chart */}
        <div className="text-2xl font-bold pb-1 pt-5">
          <Chart1 />
        </div>

        {/* =====================================================
            ADMIN BULK USER UPLOAD SECTION
            ===================================================== */}

        {localStorage.getItem("role") === "admin" && (
          <div className="mt-8 px-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                
                {/* Left Section */}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                      <Upload
                        size={24}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Bulk User Upload
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Upload users and their child information in bulk
                        using an Excel/CSV file.
                      </p>
                    </div>
                  </div>

                  {/* Required Fields */}
                  <div className="mt-5">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Excel file must contain:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "name",
                        "email",
                        "mobile",
                        "password",
                        "childName",
                        "childAge",
                        "childGrade",
                        "subject",
                      ].map((field) => (
                        <span
                          key={field}
                          className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Download Template */}
                  <button
                    type="button"
                    onClick={downloadUserTemplate}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Download size={18} />

                    Download Template
                  </button>

                  {/* Upload */}
                  <button
                    type="button"
                    onClick={handleBulkUpload}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    <Upload size={18} />

                    Upload User List
                  </button>
                </div>
              </div>

              {/* Information */}
              <div className="mt-5 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Each Excel row creates one user account and one child
                  record. The child subject must be provided in the
                  <strong> subject </strong>
                  column.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </UILayout>
  );
};

export default Dashboard;
