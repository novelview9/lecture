import _ from "lodash";
import toStyle from "css-to-style";
import useFitText from "use-fit-text";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { createBreakpoint } from "react-use";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import useWindowHeight from "../hooks/windowHeight";
import { darkModeAtom, frameHeightAtom, lockAtom } from "../atom";

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 350 });

function Text({ obj, addFixedData, isFull }) {
    const [lock] = useAtom(lockAtom);
    const [fixed, setFixed] = useState();
    const breakpoint = useBreakpoint();
    const height = useWindowHeight();
    const onClick = (e) => {
        if (lock) {
            return;
        }
        setFixed(true);
        const { top, right, bottom, left, width, height, x, y } = e.currentTarget.getBoundingClientRect();
        addFixedData({
            label: "P",
            text: obj.text_content,
            src: e.target.src,
            style: _.pick(window.getComputedStyle(e.currentTarget), ["font-size", "padding", "color", "background-color", "line-height", "letter-spacing", "font-weight", "font-family"]),
            top,
            right,
            bottom,
            left,
            width,
            height,
            x,
            y,
        });
    };
    // const { fontSize, ref } = useFitText({ maxFontSize: parseInt(goal), resolution: 5 });
    const [dark] = useAtom(darkModeAtom);
    const [frameHeight] = useAtom(frameHeightAtom);
    const [goal, setGoal] = useState({ fontSize: 15, lineHeight: 150 });
    useEffect(() => {
        let size = obj.avail_font_size * (isFull ? 1.2 : 1);
        if (frameHeight && height && ["S", "L"].includes(breakpoint)) {
            size *= ((height - 80) / frameHeight) * 0.8;
            setGoal({ fontSize: size, lineHeight: 130 });
        } else {
            setGoal({ fontSize: size, lineHeight: 150 });
        }
    }, [frameHeight, height, isFull]);

    return (
        <Container fixed={fixed} isDark={dark}>
            {/* <Font ref={ref} style={{ fontSize }} color={obj.color_font} bg={obj.color_bg} onClick={onClick}>
                {obj.text_content}
            </Font> */}
            <P goal={goal} onClick={onClick} bg={obj.color_bg} color={obj.color_font} typeFace={obj.typeface}>
                {obj.text_content}
            </P>
        </Container>
    );
}

const P = styled.p`
    font-size: ${(props) => props.goal.fontSize}em;
    width: 100%;
    line-height: ${(props) => props.goal.lineHeight}%;
    letter-spacing: 0;
    color: ${(props) => (props.color ? `rgb${props.color}` : "black")};
    background-color: ${(props) => (props.bg ? `rgb${props.bg}` : "black")};
    font-family: ${(props) => props.typeFace};
`;

const Container = styled.div`
    flex: 1;
    flex-basis: 0;
    cursor: pointer;
    min-height: 20px;
    background-color: white;
    box-sizing: border-box;
    visibility: ${(props) => (props.fixed ? "hidden" : "visiable")};
    background-color: ${(props) => (props.isDark ? "rgb(47, 48, 49)" : "white")};
`;

export default Text;
