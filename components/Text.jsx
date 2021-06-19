import _ from "lodash";
import toStyle from "css-to-style";
import useFitText from "use-fit-text";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { useState } from "react";

function Text({ content, addFixedData, goal }) {
    const [fixed, setFixed] = useState();
    const onClick = (e) => {
        setFixed(true);
        const { top, right, bottom, left, width, height } = e.currentTarget.getBoundingClientRect();
        const x = e.currentTarget.offsetLeft;
        const y = e.currentTarget.offsetTop;
        addFixedData({
            label: "P",
            text: e.currentTarget.textContent,
            src: e.target.src,
            style: _.pick(window.getComputedStyle(e.currentTarget), ["font-size", "padding", "color", "background-color"]),
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
    const { fontSize, ref } = useFitText({ maxFontSize: goal });
    return (
        <Container fixed={fixed} onClick={onClick} ref={ref} style={{ fontSize }}>
            {content}
        </Container>
    );
}

const Container = styled.div`
    flex: 1;
    flex-shrink: 1;
    width: 100%;
    cursor: pointer;
    min-height: 20px;
    background-color: white;
    padding: 5px;
    box-sizing: border-box;
    visibility: ${(props) => (props.fixed ? "hidden" : "visiable")};
`;
const TextEl = styled.p`
    /* font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")}; */
    max-width: 100%;
    z-index: 200;
    /* @media only screen and (max-width: 900px) {
        font-size: 15px;
    } */
`;

export default Text;
