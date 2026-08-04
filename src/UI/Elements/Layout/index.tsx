// @ts-nocheck
export default function UILayout({ children, background = 'bg-white' }) {
  return (
    <div className={`${background} mx-6 my-4   py-[24px] pt-3 rounded-[6px] `}>
      {children}
    </div>
  );
}
