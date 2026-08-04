import ActionCell from "@/UI/Elements/Table/ActionCell";
import CustomTableWrapper from "@/UI/Container/CustomTableWrapper";
import UILayout from "@/UI/Elements/Layout";
import { setFormOpen, setRefresh } from "@/slice/layoutSlice";
import { useDispatch } from "react-redux";
import {
  useGetChildrenListQuery,
  useGetUserListQuery,
} from "@/service/children";
import { Plus } from "lucide-react";
import UIButton from "@/UI/Elements/Button";
import UIDialog from "@/UI/Elements/Dialog";
import DynamicForm from "@/UI/Form/DynamicForm";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateTopicLimitMutation } from "@/service/user";
import { SuccessToaster } from "@/UI/Elements/Toast";
import UIBadge from "@/UI/Elements/Badge";

const Departments = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [childId, setChildId] = useState("");

  const [updateTopicLimit] =
    useUpdateTopicLimitMutation();

  const modalMethods = useForm({
    defaultValues: {
      topicLimit: "",
    },
  });

  const childrenTableColumns: ColumnDefinition<RowData>[] = [
    {
      header: "Name",
      class: "",
      accessor: "name",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "text-black",
      headerClass: "",
    },
    {
      header: "Parent",
      class: "",
      accessor: "owner",
      cell: (info) => <span>{info.getValue()?.name || "-"}</span>,
      cellClass: "",
      headerClass: "",
    },
    {
      header: "Age",
      class: "",
      accessor: "age",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "",
      headerClass: "",
    },
    {
      header: "Grade",
      class: "",
      accessor: "grade",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "",
      headerClass: "",
    },
    {
      header: "Topics",
      class: "",
      accessor: "topics",
      cell: (info) => {
        const topics = info.getValue();
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.isArray(topics) && topics.length > 0 ? (
              topics.map((topic: string, index: number) => (
                <UIBadge key={index} colorStyle="blue" size="small">
                  {topic}
                </UIBadge>
              ))
            ) : (
              <span className="text-gray-400">No topics</span>
            )}
          </div>
        );
      },
      cellClass: "",
      headerClass: "w-1/4",
    },
    {
      header: "Topic Limit",
      class: "",
      accessor: "topicLimit",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "",
      headerClass: "",
    },
    {
      header: "actions",
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
          <>
            <ActionCell
              row={updatedRow}
              viewUrl="children"
              formComponent="addChildren"
              deleteComponent={
                userRole === "admin" ? "deleteChildren" : undefined
              }
            />
            {userRole === "admin" && (
              <UIButton
                variant="sky"
                size="xs"
                className="ml-3 rounded-full"
                tooltipContent={"View Details"}
                onClick={() => {
                  modalMethods.reset({ topicLimit: row.original.topicLimit });
                  setIsModalOpen(true);
                  setChildId(row.original._id);
                }}
              >
                Update Topics
              </UIButton>
            )}
          </>
        );
      },
    },
  ];

  const buttons = [
    {
      label: "Add New Children",
      icon: <Plus />,
      onClick: () => dispatch(setFormOpen({ sheetComponent: "addChildren" })),
    },
  ];

  const handleModalFormSubmit = async (modalValues) => {
    await updateTopicLimit({ id: childId, ...modalValues }).unwrap();
    SuccessToaster("Records Update Successfully");
    setIsModalOpen(false);
    dispatch(setRefresh());
  };

  const modalFields = [
    {
      name: "topicLimit",
      label: "Topic Limit",
      placeholder: "Enter Limit ...",
      type: "number",
      wrapperClassName: "mb-6",
      fieldWrapperClassName: "col-span-6",
    },
  ];

  return (
    <div>
      <UILayout>
        <h1 className="text-3xl font-semibold m-2 mx-4">{"Children"}</h1>
        <CustomTableWrapper
          fetchData={useGetChildrenListQuery}
          columns={childrenTableColumns}
          buttons={buttons}
        />
      </UILayout>
      <UIDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {}}
        showFooter={false}
        header={"Confirm Update"}
        description={"Are you sure you want to update this record?"}
      >
        <DynamicForm
          fields={modalFields}
          onSubmit={handleModalFormSubmit}
          useFormMethods={modalMethods}
          showButton={true}
        />
      </UIDialog>
    </div>
  );
};

export default Departments;
