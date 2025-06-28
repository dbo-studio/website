export default function WindowsIcon({
	className,
	style,
}: {
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			className={className}
			fill="currentColor"
			aria-hidden="true"
			style={style}
		>
			<title>Windows Logo</title>
			<path
				d="M0 0H9.5V9.5H0V0ZM10.5 0H20V9.5H10.5V0ZM0 10.5H9.5V20H0V10.5ZM10.5 10.5H20V20H10.5V10.5Z"
				fill="#0078D4"
			/>
		</svg>
	);
}
