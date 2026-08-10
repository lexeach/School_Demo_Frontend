import ActionCell from "@/UI/Elements/Table/ActionCell";
import CustomTableWrapper from "@/UI/Container/CustomTableWrapper";
import UILayout from "@/UI/Elements/Layout";
import { setFormOpen } from "@/slice/layoutSlice";
import { useDispatch } from "react-redux";
import { useGetUserListQuery } from "@/service/user";
import { Plus, Upload } from "lucide-react";

const UserList = () => {
  const dispatch = useDispatch();

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
              delete: userRole === "admin",
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
   * Admin/User List buttons
   *
   * Upload User List opens the bulk Excel upload form.
   *
   * Excel format:
   *
   * name
   * email
   * mobile
   * password
   * childName
   * childAge
   * childGrade
   * subject
   */
  const buttons = [
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

    {
      label: "Add User",
      icon: <Plus size={18} />,
      onClick: () =>
        dispatch(
          setFormOpen({
            sheetComponent: "addUser",
          })
        ),
    },
  ];

  return (
    <div>
      <UILayout>
        <div className="flex items-center justify-between m-2 mx-4">
          <h1 className="text-3xl font-semibold">
            Users
          </h1>
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
