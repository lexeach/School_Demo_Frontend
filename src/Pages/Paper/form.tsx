import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddPaperMutation, useGetChildrenListClassQuery } from "@/service/paper";
import { ErrorToaster, SuccessToaster } from "@/UI/Elements/Toast";
import { useGetSubjectOptionsMutation } from "@/service/subject";
import { useGetSyllabusOptionsMutation } from "@/service/syllabus";
import DynamicForm from "@/UI/Form/DynamicForm";
import FixedButtons from "@/UI/Form/FixedButton";
import SheetHeader from "@/UI/Sheet/header";
import UIButton from "@/UI/Elements/Button";
import { setRefresh } from "@/slice/layoutSlice";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { fields, schema } from "./config"; // Assuming the config file is in the same directory
import { Loader } from "lucide-react";
import { useGetChildrenListQuery } from "@/service/children";
import { useNavigate } from "react-router-dom";
import { useMobileKeyboardPrevention } from "@/Hooks/useMobileKeyboardPrevention";

type PaperFormProps = {
  handleCancel: () => void;
  sheet: { id?: string };
};

const PapersForm: React.FC<PaperFormProps> = ({ handleCancel, sheet }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useMobileKeyboardPrevention(); // Add the hook to prevent keyboard on mobile
  const [data, setData] = useState({});
  const [createPaper, { isLoading: isCreateLoading }] = useAddPaperMutation();
  const [currentClass, setCurrentClass] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [currentSyllabus, setCurrentSyllabus] = useState(null); // Add state for syllabus
  const [currentTopics, setCurrentTopics] = useState([]); // Add state for topics
  const { data: childrenListClass } = useGetChildrenListClassQuery({});

  const methods = useForm({
    resolver: yupResolver(schema),
  });
  const selectedTopic = methods.watch("topics");

  const onSubmit = async (formData) => {
    try {

      const result = await createPaper(formData).unwrap();
      SuccessToaster("Records Created Successfully");
      dispatch(setRefresh());
      navigate(`/papers/${result?.data?._id}`);
      handleCancel();
    } catch (error) {
      ErrorToaster(error?.data?.message || "Something Went Wrong");
    }
  };

  const Footer = () => (
    <div className="flex justify-end mt-3 layout-container">
      <UIButton
        variant="outline"
        className="mr-4 rtl:ml-4"
        onClick={handleCancel}
      >
        {"Cancel"}
      </UIButton>
      <UIButton
        type="submit"
        onClick={methods.handleSubmit(onSubmit)}
        disabled={isCreateLoading}
      >
        {isCreateLoading ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            <span className="mx-3">Loading...</span>
          </>
        ) : sheet?.id ? (
          "Save Changes"
        ) : (
          "Generate Test"
        )}
      </UIButton>
    </div>
  );
  const { data: childrenListData } = useGetChildrenListQuery({
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="">
      <SheetHeader title={"Generate Mock Test"} />
      <div className="layout-container h-[75vh] overflow-auto">
        <div className="mt-6">
          <div className="layout-container mt-6">
            <div className="grid md:grid-cols-1 grid-cols-1 gap-6">
              <div>
                {(!sheet.id || (sheet.id && Object.keys(data)).length > 0) && (
                  <DynamicForm
                    fields={fields(
                      useGetSubjectOptionsMutation,
                      useGetSyllabusOptionsMutation,
                      currentClass,
                      setCurrentClass,
                      currentSubject,
                      setCurrentSubject,
                      currentSyllabus, // Pass currentSyllabus
                      setCurrentSyllabus, // <-- Missing comma added here
                      childrenListData?.data,
                      childrenListClass,
                      selectedTopic,
                      currentTopics,
                      setCurrentTopics,
                    )}
                    fetchData={useGetChildrenListQuery}
                    onSubmit={(val) => {
                      setData({ ...data, ...val });
                    }}
                    useFormMethods={methods}
                    showButton={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FixedButtons CustomComponent={Footer} nextLabel={""} prevLabel={""} />
    </div>
  );
};

export default PapersForm;
