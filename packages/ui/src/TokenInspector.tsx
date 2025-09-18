import { useEffect, useState } from "react";
import '@protoline/tokens/dist/css/tokens.css';

type TokenInspectorProps = {
  category: string;
};

export const TokenInspector = ({ category }: TokenInspectorProps) => {
  const [tokens, setTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    const tokens: Record<string, string> = {};
  
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
            const style = rule.style;
            for (const name of Array.from(style)) {
              if (name.startsWith(`--${category}`)) {
                tokens[name] = style.getPropertyValue(name).trim();
              }
            }
          }
        }
      } catch (e) {
        // Some sheets may be cross-origin and throw; skip them
      }
    }
  
    //console.log("Collected tokens:", tokens);
    setTokens(tokens);
  }, [category]);
  
  

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h3>{category} tokens</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(tokens).map(([name, value]) => (
          <li key={name} style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
            <code>{name}</code>: {value}
            {category === "color" && (
              <span
                style={{
                  display: "inline-block",
                  marginLeft: "8px",
                  width: "16px",
                  height: "16px",
                  backgroundColor: `var(${name})`,
                  border: "1px solid #ccc"
                }}
              />
            )}
            {category === "shadow" && (
              <div
                style={{
                  backgroundColor: "var(--color-primary)",
                  width: "50px",
                  height: "30px",
                  marginLeft: "8px",
                  borderRadius: "4px",
                  display: "inline-block",
                  boxShadow: `var(${name})`
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
