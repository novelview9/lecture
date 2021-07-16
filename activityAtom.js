import { atom } from "jotai";

const activityAtom = atom({
    action: "playing",
    time: 0,
    slide: 0,
});

const lockAtom = atom(false);

const playingAtom = atom(false);
const withFrameAtom = atom(false);
const withVideoAtom = atom(true);
const darkModeAtom = atom(false);
const mobileModeAtom = atom(false);
export default activityAtom;
export { playingAtom, lockAtom, withFrameAtom, withVideoAtom, darkModeAtom, mobileModeAtom };
