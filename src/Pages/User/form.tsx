import { ErrorToaster, SuccessToaster } from "@/UI/Elements/Toast";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import DynamicForm from "@/UI/Form/DynamicForm";
import FixedButtons from "@/UI/Form/FixedButton";
import SheetHeader from "@/UI/Sheet/header";
import UIButton from "@/UI/Elements/Button";
import { setRefresh } from "@/slice/layoutSlice";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { fields, schema } from "./config";
import {
  useGetSingleUserQuery,
  useUpdateUserLimitMutation,
} from "@/service/user";

type UserFormProps = {
  handleCancel: () => void;
  sheet: { id?: string };
};

const UserForm: React.FC<UserFormProps> = ({ handleCancel, sheet }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const { data: singleUser } = useGetSingleUserQuery(sheet?.id, {
    skip: !sheet?.id,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const [updateUserLimit, { isLoading: isUpdateLoading }] =
    useUpdateUserLimitMutation();

  const methods = useForm({
    resolver: yupResolver(schema),
  });
  //name age grade

  useEffect(() => {
    if (singleUser?.data) {
      const { childLimit, topicLimit } = singleUser?.data;
      methods.reset({ childLimit, topicLimit });
    }
  }, [singleUser?.data]);

  const onSubmit = async (formData) => {
    try {
      // return;
      if (sheet?.id) {
        await updateUserLimit({ id: sheet?.id, ...formData }).unwrap();
        SuccessToaster("Records Update Successfully");
      } 
      handleCancel();
      dispatch(setRefresh());
    } catch (error) {
            console.log('error', error);
      
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
        disabled={isUpdateLoading}
      >
        {sheet?.id ? "Save Changes" : "Save"}
      </UIButton>
    </div>
  );

  return (
    <div className="">
      <SheetHeader title={"Update Limitation"} />
      <div className="layout-container h-[75vh] overflow-auto">
        <div className="mt-6">
          <div className="layout-container mt-6">
            <div className="grid md:grid-cols-1 grid-cols-1 gap-6">
              <div>
                {
                  <DynamicForm
                    fields={fields}
                    onSubmit={(val) => {
                      setData({ ...data, ...val });
                    }}
                    loading={false}
                    useFormMethods={methods}
                    showButton={false}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <FixedButtons CustomComponent={Footer} />
    </div>
  );
};

export default UserForm;
