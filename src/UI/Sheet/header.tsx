const SheetHeader = ({ title }) => {
  return (
    <div className="flex h-14 items-center border-b lg:h-[60px] w-full ">
      <p className="text-left layout-container w-full flex gap-2 font-bold text-2xl px-6">
        {(title)}
      </p>
    </div>
  );
};

export default SheetHeader;
