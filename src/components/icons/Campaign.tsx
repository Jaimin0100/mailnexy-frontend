import React from 'react';

interface IconProps {
  className?: string;
}

const CampaignIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M2 12C2 8.22876 2 6.34315 3.46447 5.17157C4.92893 4 7.28595 4 12 4C16.714 4 19.0711 4 20.5355 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.5355 18.8284C19.0711 20 16.714 20 12 20C7.28595 20 4.92893 20 3.46447 18.8284C2 17.6569 2 15.7712 2 12Z" 
      stroke="currentColor"
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M20.6667 5.31006L15.8412 9.79897C14.0045 11.3295 13.0862 12.0948 12.0001 12.0948C10.9139 12.0948 9.99561 11.3295 8.15897 9.79897L3.3335 5.31006" 
      stroke="currentColor"
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default CampaignIcon;