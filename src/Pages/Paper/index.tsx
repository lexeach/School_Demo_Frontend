//src/Pages/Paper/index.tsx
import ActionCell from "@/UI/Elements/Table/ActionCell";
import CustomTableWrapper from "@/UI/Container/CustomTableWrapper";
import UILayout from "@/UI/Elements/Layout";
import { setFormOpen } from "@/slice/layoutSlice";
import { useDispatch } from "react-redux";
import { useGetPaperListQuery } from "@/service/paper";
import { Plus, PlusIcon, ScanEye } from "lucide-react";
import UIButton from "@/UI/Elements/Button";
import { useNavigate } from "react-router-dom";

const Papers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paperTableColumns = [
    {
      header: "Subject",
      class: "",
      enableSorting: true,
      accessor: "subject",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "text-black",
      headerClass: "text-center justify-center",
    },
    {
      header: "Children",
      class: "",
      accessor: "children",
      cell: (info) => <span>{info.getValue()?.name || '-'}</span>,
      cellClass: "text-black ",
      headerClass: "",
    },
    {
      header: "Class",
      class: "",
      accessor: "className",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "text-black ",
      headerClass: "",
    },
    {
      header: "Language",
      class: "",
      accessor: "language",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: "text-black ",
      headerClass: "",
    },
    {
      header: "Chapter From",
      class: "",
      accessor: "chapter_from",
      cell: (info) => <span>{info.getValue()}</span>,
      cellClass: " text-black ",
      headerClass: "",
    },
   // {
     // header: "Chapter To",
      //class: "",
      //accessor: "chapter_to",
      //cell: (info) => <span>{info.getValue()}</span>,
      //cellClass: " text-black ",
      //headerClass: "",
    //},
   {
  header: "Status",
  accessor: "paperStatus",
  cell: (info) => {
    const paper = info.row.original;

    const questions = paper.questions || [];
    const answers = paper.answers || [];

    const totalMarks = questions.length;

    const obtainedMarks = answers.reduce((score, answer) => {
      const question = questions.find(
        (q) => q.questionNumber === answer.questionNumber
      );

      if (answer.option === "E") {
        return score;
      }

      if (question?.correctAnswer === answer.option) {
        return score + 1;
      }

      return score - 2;
    }, 0);

    const percentage =
      totalMarks > 0
        ? Math.max(0, (obtainedMarks / totalMarks) * 100)
        : 0;

    // ✅ Auto Complete if 100% score
    const status =
      percentage === 100
        ? "Completed"
        : paper.paperStatus || "Pending";

    return (
      <span
        className={`px-2 py-1 rounded text-white text-xs font-semibold ${
          status === "Completed"
            ? "bg-green-600"
            : "bg-red-500"
        }`}
      >
        {status}
      </span>
    );
  },
},
    {
      header: "OTP",
      class: "",
      accessor: "otp",
      cell: (info) => (
        <span>
          {info.getValue() ? (
            info.getValue()
          ) : (
            <span className=""> - - - - - </span>
          )}
        </span>
      ),
      cellClass: " text-black ",
      headerClass: "",
    },
    {
      header: "CreatedAt",
      class: "",
      accessor: "createdAt",
      cell: (info) => {
        const rawDate = info.getValue();
        if (!rawDate) return <span>-</span>; // Handle cases where date might be null or undefined

        try {
          const date = new Date(rawDate);
          // Check if the date is valid before formatting
          if (isNaN(date.getTime())) {
            return <span>Invalid Date</span>;
          }

          // Format the date to Indian Standard Time (IST)
          // Options for full date and time, adjust as needed
          const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true, // Use 12-hour clock with AM/PM
            timeZone: "Asia/Kolkata",
          };

          const formattedDate = date.toLocaleString("en-IN", options); // 'en-IN' for Indian locale formatting

          return <span>{formattedDate}</span>;
        } catch (error) {
          console.error("Error formatting date:", error);
          return <span>Error</span>; // Display an error if date parsing fails
        }
      },
      cellClass: "text-black ",
      headerClass: "",
    },
    {
      header: "Total Questions",
      class: "",
      accessor: "totalQuestions",
      cell: (info) => {
        const totalQuestions = info.row.original.questions?.length || 0;
        return <span>{totalQuestions}</span>;
      },
      cellClass: "text-black ",
      headerClass: "",
    },
    {
      header: "Creator",
      class: "",
      accessor: "author",
      cell: (info) => {
        const author = info.getValue()?.name || ' - ';
        return author ? <span>{author}</span> : <span> - </span>;
      },
      cellClass: "text-black ",
      headerClass: "",
    },
    {
      header: "Marks Obtained",
      class: "",
      accessor: "marksObtained",
      cell: (info) => {
        const { questions = [], answers = [] } = info.row.original;
        const obtainedMarks = answers.reduce((score, answer) => {
          const question = questions.find(
            (q) => q.questionNumber === answer.questionNumber
          );

          // If answer is "E" (no answer/skip), don't add or subtract marks
          if (answer.option === "E") {
            return score;
          }

          // If answer is correct, add 1 mark
          if (question?.correctAnswer === answer.option) {
            return score + 1;
          }

          // If answer is wrong, subtract 1 mark (negative marking)
          return score - 2;
        }, 0);
        return (
          <span
            className={obtainedMarks >= 0 ? "text-green-600" : "text-red-600"}
          >
            {obtainedMarks}
          </span>
        );
      },
      cellClass: "text-black ",
      headerClass: "",
    },
    {
      header: "Percentage",
      class: "",
      accessor: "percentage",
      cell: (info) => {
        const { questions = [], answers = [] } = info.row.original;
        const totalMarks = questions.length;
        const obtainedMarks = answers.reduce((score, answer) => {
          const question = questions.find(
            (q) => q.questionNumber === answer.questionNumber
          );

          // If answer is "E" (no answer/skip), don't add or subtract marks
          if (answer.option === "E") {
            return score;
          }

          // If answer is correct, add 1 mark
          if (question?.correctAnswer === answer.option) {
            return score + 1;
          }

          // If answer is wrong, subtract 1 mark (negative marking)
          return score - 2;
        }, 0);
        // Calculate percentage, ensuring it doesn't go below 0
        const percentage =
          totalMarks > 0
            ? Math.max(0, (obtainedMarks / totalMarks) * 100).toFixed(2)
            : "0.00";
        return (
          <span
            className={obtainedMarks >= 0 ? "text-green-600" : "text-red-600"}
          >
            {percentage}%
          </span>
        );
      },
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
        const userRole = localStorage.getItem("role");
        const updatedRow = {
          ...row,
          original: {
            ...row.original,
            available_actions: {
              view: true,
              update: false,
              delete: userRole === "admin",
            },
          },
        };

        return (
          <ActionCell
            row={updatedRow}
            viewUrl="papers"
            formComponent="addPaper"
            deleteComponent={userRole === "admin" ? "deletePaper" : undefined}
            actionsConfig={[
              {
                renderComponent: (onClick: any) => (
                  <>
                    <UIButton
                      variant={!updatedRow.original?.otp ? "sky" : "white"}
                      size="xs"
                      className="ml-3 rounded-full"
                      onClick={onClick}
                      tooltipContent={"Learning"}
                      disabled={updatedRow.original?.otp}
                    >
                      {/* <ScanEye width={20} /> */}
                      Learning
                    </UIButton>
                  </>
                ),
                onClick: () => {
                  navigate(`/papers/learning/${row.original._id}`);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  const buttons = [
    {
      label: "Generate Mock Test",
      icon: <Plus />,
      onClick: () => dispatch(setFormOpen({ sheetComponent: "addPaper" })),
    },
  ];

  return (
      <UILayout>
        <h1 className="text-3xl font-semibold m-2 mx-4">{"Paper"}</h1>
        <CustomTableWrapper
          fetchData={useGetPaperListQuery}
          columns={paperTableColumns}
          buttons={buttons}
        />
      </UILayout>
  );
};

export default Papers;
