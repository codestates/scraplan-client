import React, { useRef, useState, useEffect } from "react";

// props로 plancard 데이터를 받는다.
// 그중 theme을 받는다.
interface ThemeProps {
  themeIndex?: number;
  type?: string;
}
const SetTheme = ({ themeIndex, type }: ThemeProps) => {
  const themeList =
    type === "feedback"
      ? ["😃", "🤔", "😡"]
      : ["🍽", "☕️", "🕹", "🚴🏻", "🚗", "🤔"];
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(
    themeIndex || 0,
  );
  // const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);
  const [isSelectTheme, setIsSelectTheme] = useState<boolean>(false);
  const refTheme = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setIsSelectTheme(false);
    });
  }, [isSelectTheme]);

  const handleSelectTheme = (e: React.MouseEvent<HTMLElement>) => {
    const selectThemeIndex = themeList.findIndex(
      (select) => select === e.currentTarget.textContent,
    );
    setCurrentThemeIndex(selectThemeIndex);
    setIsSelectTheme(!isSelectTheme);
  };

  return (
    <div className="set-theme">
      <div
        className="set-theme__img"
        onClick={() => setIsSelectTheme(!isSelectTheme)}
      >
        <div>{themeList[currentThemeIndex]}</div>
      </div>

      {isSelectTheme ? (
        <span
          className={`set-theme__select-btn ${isSelectTheme ? "" : "hidden"} ${
            type === "feedback" ? "feedback" : ""
          }`}
        >
          {themeList.map((theme, index) => {
            return (
              <div
                className="selectTheme"
                onClick={handleSelectTheme}
                ref={refTheme}
                key={index}
              >
                <div className="selectTheme-pick">{theme}</div>
              </div>
            );
          })}
        </span>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SetTheme;
