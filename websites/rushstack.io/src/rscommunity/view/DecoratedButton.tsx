import React from "react";
import styles from "./DecoratedButton.module.css";

export interface IDecoratedButtonProps {
  onClick?: () => void;
  style?: React.CSSProperties;
  theme?: "default" | "notice" | "white";
  disabled?: boolean;
}
export function DecoratedButton(
  props: React.PropsWithChildren<IDecoratedButtonProps>
): JSX.Element {
  let textColor: string;
  let backgroundColor: string;
  let borderColor: string;

  const borderStyles: string[] = [styles.buttonBorder];
  const innerStyles: string[] = [styles.buttonInner];

  if (props.disabled) {
    textColor = "#ffffff";
    backgroundColor = "#c0c0c0";
    borderColor = backgroundColor;
  } else {
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

    borderStyles.push(styles.buttonBorderEffect);
    innerStyles.push(
      props.theme === "white"
        ? styles.buttonInnerWhiteEffect
        : styles.buttonInnerRegularEffect
    );
  }

  return (
    <div
      className={styles.buttonOuter}
      role="button"
      tabIndex={0}
      style={props.style}
    >
      <div
        className={borderStyles.join(" ")}
        style={{
          color: textColor,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        }}
        onClick={props.disabled ? undefined : props.onClick}
      >
        <div className={innerStyles.join(" ")}>{props.children}</div>
      </div>
    </div>
  );
}
