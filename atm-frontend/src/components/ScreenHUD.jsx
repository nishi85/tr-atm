import { useActions } from "../context/actions";
import cls from "./ScreenHUD.module.css";
import { useATM } from "../context/ATMContext";
import LoadingScreen from "./screens/LoadingScreen";

export default function ScreenHUD() {
  const { actions = [] } = useActions();
  const { loading } = useATM();
  const left = actions.slice(0, 4);
  const right = actions.slice(4, 8);

  return (
    <div className={cls.hud}>
      {loading && <LoadingScreen label="Processing" />}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={cls.row}>
          <button
            className={`${cls.btn} ${cls.btnLeft}`}
            onClick={left[i]?.onPress}
            disabled={!left[i]?.onPress || left[i]?.disabled}
            aria-label={left[i]?.label?.trim() || `left ${i + 1}`}
          />
          <div className={`${cls.group} ${cls.groupLeft}`}>
            {left[i]?.label?.trim() && (
              <>
                <span className={cls.tick} />
                <span className={cls.label}>{left[i].label}</span>
              </>
            )}
          </div>
          <div className={`${cls.group} ${cls.groupRight}`}>
            {right[i]?.label?.trim() && (
              <>
                <span className={cls.label}>{right[i].label}</span>
                <span className={cls.tick} />
              </>
            )}
          </div>
          <button
            className={`${cls.btn} ${cls.btnRight}`}
            onClick={right[i]?.onPress}
            disabled={!right[i]?.onPress || right[i]?.disabled}
            aria-label={right[i]?.label?.trim() || `Right ${i + 1}`}
          />
        </div>
      ))}
    </div>
  );
}
