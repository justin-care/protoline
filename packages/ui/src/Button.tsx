
import '@protoline/tokens/dist/css/tokens.css';

type ButtonProps = {
    label: string;
    onClick?: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => (
    <button
      style={{
        backgroundColor: "var(--color-primary)",
        padding: "var(--spacing-md)",
        fontFamily: "var(--typography-font-family)",
        fontSize: "var(--typography-font-size-md)",
        fontWeight: "var(--typography-font-weight-bold)",
        color: "var(--color-background)",
        boxShadow: "var(--shadow-md)",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );