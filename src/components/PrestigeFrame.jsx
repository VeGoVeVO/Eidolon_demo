import './PrestigeFrame.css';

const PrestigeFrame = ({ children, className = '' }) => {
  return (
    <div className={`prestige-frame-wrapper ${className}`}>
      {/* Content */}
      <div className="prestige-content">
        {children}
      </div>
    </div>
  );
};

export default PrestigeFrame;

