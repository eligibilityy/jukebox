import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { recentItem } from "@/lib/music/store";
import { Background } from "./Background";
import { Clock } from "./Clock";
import { SPRING, useSwapAnimation } from "./motion";
import { NowPlayingCard } from "./NowPlayingCard";
import { QuickDial } from "./QuickDial";
import { RecentlyPlayed } from "./RecentlyPlayed";
import { SearchBar } from "./SearchBar";
import { SpotifyStatus } from "./SpotifyStatus";
import { useNowPlaying } from "./useNowPlaying";
import { useSpotifyWatcher } from "./useSpotifyWatcher";
import { useStorageValue } from "./useStorageValue";
import { animateBackgroundItem, showRecentItem } from "@/lib/settings";

function App() {
  useSpotifyWatcher();
  const nowPlaying = useNowPlaying();
  const recent = useStorageValue(recentItem) ?? [];
  const showRecent = useStorageValue(showRecentItem);
  const animateBackground = useStorageValue(animateBackgroundItem);
  const swap = useSwapAnimation();

  if (nowPlaying === undefined) return null;

  const hasTrack = nowPlaying !== null;
  const playing = nowPlaying?.isPlaying === true;

  return (
    <MotionConfig reducedMotion="user">
      <Background
        visible={hasTrack}
        coverUrl={nowPlaying?.coverUrl ?? null}
        animate={playing && animateBackground === true}
      />
      <main className={`layout ${hasTrack ? "is-playing" : "is-idle"}`}>
        <QuickDial />
        <SpotifyStatus />
        <div className="spacer-outer" />
        <Clock compact={hasTrack} />
        <div className="spacer-center">
          <AnimatePresence initial={false} mode="popLayout">
            {nowPlaying && (
              <motion.div key={nowPlaying.id} {...swap}>
                <NowPlayingCard track={nowPlaying} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          layout="position"
          layoutDependency={hasTrack}
          transition={SPRING}
          className="w-full max-w-md"
        >
          <SearchBar />
        </motion.div>
        {!hasTrack && showRecent === true && <RecentlyPlayed tracks={recent} />}
        <div className="spacer-outer" />
      </main>
    </MotionConfig>
  );
}

export default App;
