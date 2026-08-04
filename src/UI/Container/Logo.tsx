import logo from '@/assets/logo.gif';

const Logo = () => {
  return (
    <div className="relative w-full h-[70vh] bg-white">
      <img
        src={logo}
        alt="logo"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10"
      />
    </div>
  );
};

export default Logo;
