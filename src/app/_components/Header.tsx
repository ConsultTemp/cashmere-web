const Header = () => {
  return (
    <header className="w-full h-screen relative overflow-hidden">
      {/* Mobile video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover block md:hidden"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/fallback-mobile.jpg"
      >
        <source src="/cashmere-mobile.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Desktop video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover hidden md:block"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/fallback-desktop.jpg"
      >
        <source src="/cashmere-desktop.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </header>
  );
};

export default Header;
