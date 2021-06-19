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
        console.log("gg");
        console.log(e.target.inner);

        addFixedData({
            label: "P",
            text: e.currentTarget.textContent,
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
    const { fontSize, ref } = useFitText({ maxFontSize: goal });
    return (
        <Container fixed={fixed} onClick={onClick}>
            <Font ref={ref} style={{ fontSize }}>
                {content}
            </Font>
        </Container>
    );
}

const Font = styled.div`
    width: 100%;
    height: 100%;
`;
const Container = styled.div`
    flex: 1 1 100%;
    cursor: pointer;
    min-height: 20px;
    background-color: white;
    box-sizing: border-box;
    visibility: ${(props) => (props.fixed ? "hidden" : "visiable")};
    display: flex;
`;

export default Text;
