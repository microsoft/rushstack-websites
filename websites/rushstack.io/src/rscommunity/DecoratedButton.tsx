import React from "react";
import styles from "./DecoratedButton.module.css";

export interface IDecoratedButtonProps {
  onClick?: () => void;
  style?: React.CSSProperties;
  theme?: "default" | "notice" | "white";
}
export function DecoratedButton(
  props: React.PropsWithChildren<IDecoratedButtonProps>
): JSX.Element | undefined {
  let textColor: string;
  let backgroundColor: string;
  let borderColor: string;
  switch (props.theme) {
    case "notice":
      textColor = "#ffffff";
      backgroundColor = "#c95228";
      borderColor = backgroundColor;
      break;
    case "white":
      textColor = "#000000";
      backgroundColor = "#ffffff";
      borderColor = "#c0c0c0";
      break;
    default:
      textColor = "#ffffff";
      backgroundColor = "#108938";
      borderColor = backgroundColor;
      break;
  }

  const innerStyles: string[] = [styles.buttonInner];
  innerStyles.push(
    props.theme === "white"
      ? styles.buttonInnerActiveDarken
      : styles.buttonInnerActiveLighten
  );

  return (
    <div
      className={styles.buttonOuter}
      role="button"
      tabIndex={0}
      style={props.style}
    >
      <div
        className={styles.buttonBorder}
        style={{
          color: textColor,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        }}
        onClick={props.onClick}
      >
        <div className={innerStyles.join(" ")}>{props.children}</div>
      </div>
    </div>
  );
}
