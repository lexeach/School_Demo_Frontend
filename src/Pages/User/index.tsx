import ActionCell from "@/UI/Elements/Table/ActionCell";
import CustomTableWrapper from "@/UI/Container/CustomTableWrapper";
import UILayout from "@/UI/Elements/Layout";
import { setFormOpen } from "@/slice/layoutSlice";
import { useDispatch } from "react-redux";
import { useGetUserListQuery } from "@/service/user";
import { Plus } from "lucide-react";

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
      cellClass: "text-black ",
      headerClass: "",
    },
    {
      header: "Child Limit",
      class: "",
      accessor: "childLimit",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "text-black ",
      headerClass: "",
    },
 
    {
      header: "actions",
      accessor: "available_actions",
      class: "flex justify-center",
      headerClass: "flex justify-center",
      cellClass: "flex justify-center",
      cell: ({ row }) => {
        const userRole = localStorage.getItem('role');
        const updatedRow = {
          ...row,
          original: {
            ...row.original,
            available_actions: {
              view: false,
              update: true,
              delete: false//userRole=== 'admin',
            },
          },
        };
        return (
          <ActionCell
            row={updatedRow}
            viewUrl="children"
            formComponent="updateLimit"
            deleteComponent={userRole === 'admin' ? 'deleteChildren' : undefined}
          />
        );
      },
    },
  ];

  // const buttons = [
  //   {
  //     label: "Add New Children",
  //     icon: <Plus />,
  //     onClick: () => dispatch(setFormOpen({ sheetComponent: "addChildren" })),
  //   },
  // ];

  return (
    <div>
      <UILayout>
        <h1 className="text-3xl font-semibold m-2 mx-4">{"Users"}</h1>
        <CustomTableWrapper
          fetchData={useGetUserListQuery}
          columns={Columns}
          // buttons={buttons}
        />
      </UILayout>
    </div>
  );
};

export default UserList;
