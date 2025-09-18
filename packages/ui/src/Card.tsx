import '@protoline/tokens/dist/css/tokens.css';

type CardProps = {
    title: string;
    description: string;
    image: string;
}

export const Card = ({ title, description, image }: CardProps) => {
    return <div className="card" style={{
        backgroundColor: "var(--color-primary)",
        fontFamily: "var(--typography-font-family)",
        color: "white",
        padding: "var(--spacing-md)",
        borderRadius: "10px",
        boxShadow: "var(--shadow-md)",
    }}>
        <h2 style={{
            fontSize: "var(--typography-font-size-md)",
            fontWeight: "var(--typography-font-weight-bold)",
        }}>{title}</h2>
        <p style={{
            fontSize: "var(--typography-font-size-sm)",
        }}>{description}</p>
        <img src={image} alt={title} />
    </div>
}