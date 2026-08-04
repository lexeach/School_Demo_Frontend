import ActionCell from "@/UI/Elements/Table/ActionCell";
import CustomTableWrapper from "@/UI/Container/CustomTableWrapper";
import UILayout from "@/UI/Elements/Layout";
import { setFormOpen } from "@/slice/layoutSlice";
import { useDispatch } from "react-redux";
import { useGetSyllabusListQuery } from "@/service/syllabus";
import { Plus } from "lucide-react";

const Syllabus = () => {
  const dispatch = useDispatch();

  const syllabusTableColumns = [
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
            viewUrl="syllabus"
            formComponent="addSyllabus"
            deleteComponent="deleteSyllabus"
          />
        );
      },
    },
  ];

  const buttons = [
    {
      label: "Add New Syllabus",
      icon: <Plus />,
      onClick: () => dispatch(setFormOpen({ sheetComponent: "addSyllabus" })),
    },
  ];

  return (
    <div>
      <UILayout>
        <h1 className="text-3xl font-semibold m-2 mx-4">{"Syllabus"}</h1>
        <CustomTableWrapper
          fetchData={useGetSyllabusListQuery}
          columns={syllabusTableColumns}
          buttons={buttons}
        />
      </UILayout>
    </div>
  );
};

export default Syllabus;
