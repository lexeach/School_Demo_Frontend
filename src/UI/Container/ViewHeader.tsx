import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import UIButton from "../Elements/Button";
import { useNavigate } from "react-router-dom";

const ViewHeader = ({
  backUrl = "",
  heading = "Paper",
  addCallback = () => {},
  addHeading = "",
  isAdd = false,
  hideBakeURL = false,
}) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-between py-4">
        <div className="flex">
          {!hideBakeURL && (
          <ArrowLeftIcon
            width={20}
            className="mt-1 mx-2 cursor-pointer"
            onClick={() => navigate(backUrl)}
          />
        )}

          <p className="font-semibold text-4xl text-content leading-[70px] ">
            {heading}
          </p>
        </div>
        <div className="flex mt-4 h-10">
          {isAdd && (
            <UIButton
              icon={<PlusIcon height={18} className="mr-2" />}
              onClick={addCallback}
            >
              {addHeading}
            </UIButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewHeader;
