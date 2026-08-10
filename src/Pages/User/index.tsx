import ActionCell from "@/UI/Elements/Table/ActionCell";
import CustomTableWrapper from "@/UI/Container/CustomTableWrapper";
import UILayout from "@/UI/Elements/Layout";
import { setFormOpen } from "@/slice/layoutSlice";
import { useDispatch } from "react-redux";
import { useGetUserListQuery } from "@/service/user";
import { Upload } from "lucide-react";

const UserList = () => {
  const dispatch = useDispatch();

  const userRole = localStorage.getItem("role");

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
      header: "actions",
      accessor: "available_actions",
      class: "flex justify-center",
      headerClass: "flex justify-center",
      cellClass: "flex justify-center",

      cell: ({ row }) => {
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

  /**
   * Admin buttons
   *
   * This opens the bulk upload form registered
   * with sheetComponent: "bulkUploadUsers"
   */
  const buttons =
    userRole === "admin"
      ? [
          {
            label: "Upload User List",
            icon: <Upload size={18} />,
            onClick: () =>
              dispatch(
                setFormOpen({
                  sheetComponent: "bulkUploadUsers",
                })
              ),
          },
        ]
      : [];

  return (
    <div>
      <UILayout>
        <div className="flex items-center justify-between px-4">
          <h1 className="text-3xl font-semibold m-2">Users</h1>
        </div>

        <CustomTableWrapper
          fetchData={useGetUserListQuery}
          columns={Columns}
          buttons={buttons}
        />
      </UILayout>
    </div>
  );
};

export default UserList;
