import { atom } from "jotai";

const activityAtom = atom({
    action: "playing",
    time: 0,
    slide: 0,
});

export default activityAtom;
