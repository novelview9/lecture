import _ from "lodash";
import toStyle from "css-to-style";
import useFitText from "use-fit-text";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { createBreakpoint } from "react-use";
import { useState } from "react";

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 350 });

function Text({ obj, addFixedData }) {
    const [fixed, setFixed] = useState();
    const breakpoint = useBreakpoint();
    const getBreakValue = () => {
        switch (breakpoint) {
            case "XL":
                return 1;
            case "L":
                return 0.3;
            case "S":
                return 0.2;
        }
    };
    const onClick = (e) => {
        setFixed(true);
        const { top, right, bottom, left, width, height } = e.currentTarget.getBoundingClientRect();
        const x = e.currentTarget.offsetLeft;
        const y = e.currentTarget.offsetTop;
        addFixedData({
            label: "P",
            text: obj.text_content,
            src: e.target.src,
            style: _.pick(window.getComputedStyle(e.currentTarget.firstChild), ["font-size", "padding", "color", "background-color"]),
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
    const goal = obj.avail_font_size * 100 * getBreakValue();
    const { fontSize, ref } = useFitText({ maxFontSize: goal, resolution: 5 });
    return (
        <Container fixed={fixed} onClick={onClick}>
            <Font ref={ref} style={{ fontSize }} color={obj.color_font} bg={obj.color_bg}>
                {obj.text_content}
            </Font>
        </Container>
    );
}

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
    display: flex;
`;

export default Text;
