import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { SPRING } from "./motion";
import { useStorageValue } from "./useStorageValue";
import { clockFormatItem, showDateItem } from "@/lib/settings";

export function Clock({ compact }: { compact: boolean }) {
  const [time, setTime] = useState(() => new Date());

  const format = useStorageValue(clockFormatItem);
  const showDate = useStorageValue(showDateItem);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const now = new Date();
      setTime(now);

      const delay = 1000 - (Date.now() % 1000);
      timeoutId = setTimeout(tick, delay);
    };

    const delay = 1000 - (Date.now() % 1000);
    timeoutId = setTimeout(tick, delay);

    return () => clearTimeout(timeoutId);
  }, []);

  if (format === undefined) return null;

  const twelveHour = format === "12h";
  const hours = String(
    twelveHour ? time.getHours() % 12 || 12 : time.getHours(),
  );

  const minutes = String(time.getMinutes()).padStart(2, "0");

  const date = time.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`flex items-center text-center ${compact ? "flex-col" : "flex-col-reverse"}`}
    >
      {showDate === true && (
        <motion.p
          layout="position"
          layoutDependency={compact}
          transition={SPRING}
          className="date"
        >
          {date}
        </motion.p>
      )}
      <motion.h1
        layout
        layoutDependency={compact}
        transition={SPRING}
        className={`clock ${compact ? "clock-compact" : ""}`}
      >
        {hours}
        <span className="colon">:</span>
        {minutes}
      </motion.h1>
    </div>
  );
}
