import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import PaperForm from "@/Pages/Paper/form";
import ChildrenForm from "@/Pages/Children/form";
import SyllabusForm from "@/Pages/Syllabus/form";
import SubjectForm from "@/Pages/Subject/form";
import UpdateLimit from "@/Pages/User/form";

import { setSheetClose } from "@/slice/layoutSlice";

const UISheet: React.FC = () => {
  const { isSheetOpen, sheetSide, sheetStyle, sheetComponent, sheet } =
    useSelector((state: RootState) => state.layout);
  const dispatch = useDispatch();
  const handleCancel = () => {
    dispatch(setSheetClose());
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleCancel}>
      <SheetContent side={sheetSide} className={` ${sheetStyle}`}>
        <div className="min-h-[100vh]">
          {sheetComponent === "addPaper" && (
            <PaperForm handleCancel={handleCancel} sheet={sheet} />
          )}
          {sheetComponent === "addChildren" && (
            <ChildrenForm handleCancel={handleCancel} sheet={sheet} />
          )}
          {sheetComponent === "updateLimit" && (
            <UpdateLimit handleCancel={handleCancel} sheet={sheet} />
          )}

          {sheetComponent === "addSubject" && (
            <SubjectForm handleCancel={handleCancel} sheet={sheet} />
          )}
          {sheetComponent === "addSyllabus" && (
            <SyllabusForm handleCancel={handleCancel} sheet={sheet} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UISheet;
