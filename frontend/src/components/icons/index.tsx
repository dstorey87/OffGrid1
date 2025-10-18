import React from 'react';
import { IconWrapper } from './IconWrapper';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Water Drop Icon
export function WaterIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="info" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M12 2.69L17.66 8.35C19.78 10.47 19.78 13.87 17.66 15.99C15.54 18.11 12.14 18.11 10.02 15.99C7.9 13.87 7.9 10.47 10.02 8.35L12 2.69Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M12 2.69L17.66 8.35C19.78 10.47 19.78 13.87 17.66 15.99C15.54 18.11 12.14 18.11 10.02 15.99C7.9 13.87 7.9 10.47 10.02 8.35L12 2.69Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
    </IconWrapper>
  );
}

// Solar/Sun Icon
export function SolarIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="warning" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9" />
        <path
          d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Lightning/Energy Icon
export function EnergyIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="warning" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
          fill="currentColor"
          opacity="0.9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Battery Icon
export function BatteryIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="success" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect x="2" y="7" width="18" height="10" rx="2" fill="currentColor" opacity="0.2" />
        <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="9" width="14" height="6" rx="1" fill="currentColor" opacity="0.8" />
        <path d="M20 10H22V14H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </IconWrapper>
  );
}

// Plant/Growing Icon
export function PlantIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="success" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M12 22V11M12 11C12 8 14 6 17 6C17 9 15 11 12 11ZM12 11C12 8 10 6 7 6C7 9 9 11 12 11Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22C12 22 15 20 15 17C15 14 12 11 12 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse cx="12" cy="21" rx="4" ry="1" fill="currentColor" opacity="0.3" />
      </svg>
    </IconWrapper>
  );
}

// Shopping Cart Icon
export function CartIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path d="M9 2L7.17 4H1V6H2L5 16H19L22 6H4.82L6 4H9V2Z" fill="currentColor" opacity="0.2" />
        <circle cx="9" cy="20" r="1.5" fill="currentColor" />
        <circle cx="17" cy="20" r="1.5" fill="currentColor" />
        <path
          d="M1 2H5.27L8.23 11H19L21 6H7M8 16H19"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Chart/Analytics Icon
export function ChartIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="info" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="10" y="7" width="4" height="14" rx="1" fill="currentColor" opacity="0.9" />
        <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor" />
      </svg>
    </IconWrapper>
  );
}

// Tools/Settings Icon
export function ToolsIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M14.7 6.3L16.3 4.7C17.5 3.5 19.5 3.5 20.7 4.7C21.9 5.9 21.9 7.9 20.7 9.1L19.1 10.7M14.7 6.3L7 14L5 19L10 17L17.7 9.3L14.7 6.3Z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M12 17L14 19M7 22L3 18M3 7V4H6M21 11V14H18M14.7 6.3L16.3 4.7C17.5 3.5 19.5 3.5 20.7 4.7C21.9 5.9 21.9 7.9 20.7 9.1L19.1 10.7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Money/Cost Icon
export function MoneyIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="success" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 6V8M12 16V18M9 9.5C9 8.67 9.67 8 10.5 8H13C13.83 8 14.5 8.67 14.5 9.5C14.5 10.33 13.83 11 13 11H11C10.17 11 9.5 11.67 9.5 12.5C9.5 13.33 10.17 14 11 14H13.5C14.33 14 15 14.67 15 15.5C15 16.33 14.33 17 13.5 17H10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Target/Goal Icon
export function TargetIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="primary" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.9" />
        <path
          d="M12 3V6M12 18V21M3 12H6M18 12H21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Diamond/Premium Icon
export function DiamondIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="primary" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path d="M12 2L4 8L12 22L20 8L12 2Z" fill="currentColor" opacity="0.2" />
        <path
          d="M12 2L4 8L12 22L20 8L12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 8H20M12 8V22M7 2L12 8L17 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Building/Construction Icon
export function BuildingIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect x="4" y="6" width="16" height="16" rx="1" fill="currentColor" opacity="0.2" />
        <path d="M4 10H20M4 14H20M4 18H20" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <rect x="4" y="2" width="16" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8" y="6" width="2" height="2" fill="currentColor" />
        <rect x="14" y="6" width="2" height="2" fill="currentColor" />
        <rect x="8" y="14" width="2" height="2" fill="currentColor" />
        <rect x="14" y="14" width="2" height="2" fill="currentColor" />
      </svg>
    </IconWrapper>
  );
}

// Checkmark Icon
export function CheckIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="success" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
        <path
          d="M7 12L10 15L17 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Lightbulb/Idea Icon
export function LightbulbIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="warning" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M9 18H15M10 21H14M12 3C8.69 3 6 5.69 6 9C6 11.5 7.5 13.5 9 15V18H15V15C16.5 13.5 18 11.5 18 9C18 5.69 15.31 3 12 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7V9M12 11V13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path d="M9 15H15" fill="currentColor" opacity="0.3" />
      </svg>
    </IconWrapper>
  );
}

// Wave/Water Flow Icon
export function WaveIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="info" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M2 12C2 12 4 8 6 8C8 8 10 12 12 12C14 12 16 8 18 8C20 8 22 12 22 12M2 18C2 18 4 14 6 14C8 14 10 18 12 18C14 18 16 14 18 14C20 14 22 18 22 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 6C2 6 4 2 6 2C8 2 10 6 12 6C14 6 16 2 18 2C20 2 22 6 22 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />
      </svg>
    </IconWrapper>
  );
}

// Document/Report Icon
export function DocumentIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 12H16M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </IconWrapper>
  );
}

// Scale/Balance Icon
export function ScaleIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M12 3V21M12 21H8M12 21H16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M7 9L4 15H10L7 9ZM17 9L14 15H20L17 9Z"
          fill="currentColor"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M7 9H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </IconWrapper>
  );
}

// Folder/Directory Icon
export function FolderIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M3 7V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V9C21 7.9 20.1 7 19 7H11L9 5H5C3.9 5 3 5.9 3 7Z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M3 7V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V9C21 7.9 20.1 7 19 7H11L9 5H5C3.9 5 3 5.9 3 7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Education/Graduation Icon
export function EducationIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="primary" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path d="M12 4L2 9L12 14L22 9L12 4Z" fill="currentColor" opacity="0.3" />
        <path
          d="M12 4L2 9L12 14L22 9L12 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 11V16L12 19L18 16V11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M2 9V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </IconWrapper>
  );
}

// AI/Robot Icon
export function AIIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="primary" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect x="6" y="7" width="12" height="11" rx="2" fill="currentColor" opacity="0.2" />
        <rect x="6" y="7" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3V7M9 2H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="11" r="1" fill="currentColor" />
        <circle cx="15" cy="11" r="1" fill="currentColor" />
        <path d="M9 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M6 18H4V20M18 18H20V20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Globe/World Icon
export function GlobeIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} variant="info" className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M2 12H22M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </IconWrapper>
  );
}

// People/Community Icon
export function PeopleIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <circle cx="9" cy="7" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="7" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="15" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M3 20V18C3 16.3 4.3 15 6 15H12C13.7 15 15 16.3 15 18V20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M13 20V18C13 16.3 14.3 15 16 15H18C19.7 15 21 16.3 21 18V20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </IconWrapper>
  );
}

// Book/Guide Icon
export function BookIcon({ className, size = 'md' }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M4 4.5C4 3.1 5.1 2 6.5 2H20V20H6.5C5.1 20 4 18.9 4 17.5V4.5Z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M4 4.5C4 3.1 5.1 2 6.5 2H20V20H6.5C5.1 20 4 18.9 4 17.5V4.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 18C4 19.1 5.1 20 6.5 20H20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M8 6H16M8 10H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </IconWrapper>
  );
}

const Icons = {
  Water: WaterIcon,
  Solar: SolarIcon,
  Energy: EnergyIcon,
  Battery: BatteryIcon,
  Plant: PlantIcon,
  Cart: CartIcon,
  Chart: ChartIcon,
  Tools: ToolsIcon,
  Money: MoneyIcon,
  Target: TargetIcon,
  Diamond: DiamondIcon,
  Building: BuildingIcon,
  Check: CheckIcon,
  Lightbulb: LightbulbIcon,
  Wave: WaveIcon,
  Document: DocumentIcon,
  Scale: ScaleIcon,
  Folder: FolderIcon,
  Education: EducationIcon,
  AI: AIIcon,
  Globe: GlobeIcon,
  People: PeopleIcon,
  Book: BookIcon,
};

export default Icons;
