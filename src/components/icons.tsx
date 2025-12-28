import type { SVGProps } from "react";

export function FortressGateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22V18" />
      <path d="M4 22V9.5C4 8.1 5.1 7 6.5 7H17.5C18.9 7 20 8.1 20 9.5V22" />
      <path d="M2 22h20" />
      <path d="M7 7V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" />
      <path d="M10 14h4" />
    </svg>
  );
}
