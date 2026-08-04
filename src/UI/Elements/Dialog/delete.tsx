// @ts-nocheck

import { Check, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import DialogErrorIcon from "@/assets/DeleteDialogIcon.svg?react";
import UIButton from "../Button";
import { setDialogOpen } from "@/slice/layoutSlice";
import { useDeleteHandler } from "@/Hooks/useDeleteHandler";

const dialogType = {
  deletePaper: {
    title: "Delete Paper",
    description:
      "Are you sure you want to delete this paper ? This action cannot be undone.",
  },
  deleteChildren: {
    title: "Delete Children",
    description:
      "Are you sure you want to delete this children ? This action cannot be undone.",
  },
  deleteSubject: {
    title: "Delete Subject",
    description:
      "Are you sure you want to delete this subject ? This action cannot be undone.",
  },
  deleteSyllabus: {
    title: "Delete Syllabus",
    description:
      "Are you sure you want to delete this syllabus ? This action cannot be undone.",
  },
};

export function DeleteDialog() {
  const layout = useSelector((item) => item.layout);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    dialog: { actionButton, cancelButton, actionCallbackId = "", data },
    isDialogOpen,
  } = layout;

  const deleteAction = useDeleteHandler(
    actionCallbackId,
    data?.id,
    actionCallbackId
  );

  if (!actionCallbackId) {
    return;
  }
  const config = dialogType[actionCallbackId];

  const { title, description } = config;
  const handleCancel = () => {
    dispatch(setDialogOpen());
  };
  const actionCallback = async () => {
    deleteAction();
  };

  console.log("actionButton >> ", actionButton);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCancel}>
      <DialogContent className="w-[512px] flex">
        <div className="w-[full]">
          <DialogErrorIcon />
        </div>

        <div>
          <DialogHeader>
            <p className="mb-2 font-medium text-gray-900">{t(title)}</p>
            <p className="text-sm leading-5 text-gray-500">{t(description)}</p>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <UIButton
              variant="outline"
              className="rtl:ml-4"
              onClick={handleCancel}
            >
              {t(cancelButton)}
            </UIButton>
            <UIButton
              className={"bg-red-600 hover:bg-red-700"}
              onClick={actionCallback}
            >
              {t(actionButton)}
            </UIButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
