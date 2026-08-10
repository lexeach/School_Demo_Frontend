import ActionCell from "@/UI/Elements/Table/ActionCell";
import CustomTableWrapper from "@/UI/Container/CustomTableWrapper";
import UILayout from "@/UI/Elements/Layout";
import { useGetUserListQuery } from "@/service/user";
import { Upload } from "lucide-react";
import { useState } from "react";
import BulkUploadUsers from "./BulkUploadUsers";

const UserList = () => {
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const Columns: ColumnDefinition<RowData>[] = [
    {
      header: "Name",
      class: "",
      enableSorting: true,
      accessor: "name",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "text-black",
      headerClass: "",
    },
    {
      header: "Email",
      class: "",
      accessor: "email",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "text-black",
      headerClass: "",
    },
    {
      header: "Child Limit",
      class: "",
      accessor: "childLimit",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "text-black",
      headerClass: "",
    },
    {
      header: "Actions",
      accessor: "available_actions",
      class: "flex justify-center",
      headerClass: "flex justify-center",
      cellClass: "flex justify-center",

      cell: ({ row }) => {
        const userRole = localStorage.getItem("role");

        const updatedRow = {
          ...row,
          original: {
            ...row.original,
            available_actions: {
              view: false,
              update: true,
              delete: false,
            },
          },
        };

        return (
          <ActionCell
            row={updatedRow}
            viewUrl="children"
            formComponent="updateLimit"
            deleteComponent={
              userRole === "admin" ? "deleteChildren" : undefined
            }
          />
        );
      },
    },
  ];

  const userRole = localStorage.getItem("role");

  return (
    <div>
      <UILayout>
        <div className="flex items-center justify-between m-2 mx-4 mb-4">
          <h1 className="text-3xl font-semibold">
            {"Users"}
          </h1>

          {userRole === "admin" && (
            <button
              type="button"
              onClick={() => setShowBulkUpload(true)}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
            >
              <Upload size={18} />
              Bulk User Upload
            </button>
          )}
        </div>

        <CustomTableWrapper
          fetchData={useGetUserListQuery}
          columns={Columns}
        />

        {showBulkUpload && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-auto rounded-lg bg-white shadow-xl">
              <BulkUploadUsers
                handleCancel={() => setShowBulkUpload(false)}
              />
            </div>
          </div>
        )}
      </UILayout>
    </div>
  );
};

export default UserList;
