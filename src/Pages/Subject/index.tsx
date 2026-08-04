import ActionCell from "@/UI/Elements/Table/ActionCell";
import CustomTableWrapper from "@/UI/Container/CustomTableWrapper";
import UILayout from "@/UI/Elements/Layout";
import { setFormOpen } from "@/slice/layoutSlice";
import { useDispatch } from "react-redux";
import { useGetSubjectListQuery } from "@/service/subject";
import { Plus } from "lucide-react";

const Subject = () => {
  const dispatch = useDispatch();

  const subjectTableColumns = [
    {
      header: "ID",
      class: "pl-5",
      enableSorting: true,
      accessor: "_id",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "pl-4 text-black",
      headerClass: "pl-4 ",
    },
    {
      header: "Name",
      class: "pl-5",
      enableSorting: true,
      accessor: "name",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "pl-4 text-black",
      headerClass: "pl-4 ",
    },
    {
      header: "CreatedAt",
      class: "pl-5",
      accessor: "createdAt",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "pl-4 text-black ",
      headerClass: "pl-4",
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
              delete: true,
            },
          },
        };
        return (
          <ActionCell
            row={updatedRow}
            viewUrl="subject"
            formComponent="addSubject"
            deleteComponent="deleteSubject"
          />
        );
      },
    },
  ];

  const buttons = [
    {
      label: "Add New Subject",
      icon: <Plus />,
      onClick: () => dispatch(setFormOpen({ sheetComponent: "addSubject" })),
    },
  ];

  return (
    <div>
      <UILayout>
        <h1 className="text-3xl font-semibold m-2 mx-4">{"Subject"}</h1>
        <CustomTableWrapper
          fetchData={useGetSubjectListQuery}
          columns={subjectTableColumns}
          buttons={buttons}
        />
      </UILayout>
    </div>
  );
};

export default Subject;
