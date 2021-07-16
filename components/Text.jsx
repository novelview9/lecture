import _ from "lodash";
import toStyle from "css-to-style";
import useFitText from "use-fit-text";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { createBreakpoint } from "react-use";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { lockAtom } from "../activityAtom";

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 350 });

function Text({ obj, addFixedData, isFull }) {
    const [lock] = useAtom(lockAtom);
    const [fixed, setFixed] = useState();
    const breakpoint = useBreakpoint();
    const getBreakValue = () => {
        switch (breakpoint) {
            case "XL":
                return 1;
            case "L":
                return 1;
            case "S":
                return 1;
        }
    };
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
            style: _.pick(window.getComputedStyle(e.currentTarget), ["font-size", "padding", "color", "background-color", "line-height", "letter-spacing"]),
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
    const goal = obj.avail_font_size * getBreakValue() * (isFull ? 1.2 : 1);
    // const { fontSize, ref } = useFitText({ maxFontSize: parseInt(goal), resolution: 5 });

    return (
        <Container fixed={fixed}>
            {/* <Font ref={ref} style={{ fontSize }} color={obj.color_font} bg={obj.color_bg} onClick={onClick}>
                {obj.text_content}
            </Font> */}
            <P fs={goal} onClick={onClick} bg={obj.color_bg} color={obj.color_font}>
                {obj.text_content}
            </P>
        </Container>
    );
}

const P = styled.p`
    font-size: ${(props) => props.fs}em;
    width: 100%;
    line-height: 150%;
    letter-spacing: ${(props) => props.fs * 0.12}em;
    color: ${(props) => (props.color ? `rgb${props.color}` : "black")};
    background-color: ${(props) => (props.bg ? `rgb${props.bg}` : "black")};
`;
const Font = styled.div`
    width: 100%;
    height: 100%;
    color: ${(props) => (props.color ? `rgb${props.color}` : "black")};
    background-color: ${(props) => (props.bg ? `rgb${props.bg}` : "black")};
`;

const Container = styled.div`
    flex: 1;
    flex-basis: 0;
    cursor: pointer;
    min-height: 20px;
    background-color: white;
    box-sizing: border-box;
    visibility: ${(props) => (props.fixed ? "hidden" : "visiable")};
    /* display: flex; */
`;

export default Text;
