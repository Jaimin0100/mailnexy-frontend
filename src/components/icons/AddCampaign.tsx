import React from 'react';

interface IconProps {
  className?: string;
}

const AddCampaignIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    width="24" 
    height="25" 
    viewBox="0 0 24 25" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M2 12.5C2 8.72876 2 6.84315 3.46447 5.67157C4.92893 4.5 7.28595 4.5 12 4.5C16.714 4.5 19.0711 4.5 20.5355 5.67157C22 6.84315 22 8.72876 22 12.5C22 16.2712 22 18.1569 20.5355 19.3284C19.0711 20.5 16.714 20.5 12 20.5C7.28595 20.5 4.92893 20.5 3.46447 19.3284C2 18.1569 2 16.2712 2 12.5Z" 
      stroke="currentColor"
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M20.6667 5.81006L15.8412 10.299C14.0045 11.8295 13.0862 12.5948 12.0001 12.5948C10.9139 12.5948 9.99561 11.8295 8.15897 10.299L3.3335 5.81006" 
      stroke="currentColor"
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default AddCampaignIcon;