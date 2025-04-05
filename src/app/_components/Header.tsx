const Header = () => {
    return (
      <header className="w-full h-screen relative overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/cashmere-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="/cashmere-desktop.mp4" type="video/mp4" media="(min-width: 769px)" />
          Your browser does not support the video tag.
        </video>
      </header>
    );
  };
  
  export default Header;
  