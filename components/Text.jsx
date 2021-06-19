import _ from "lodash";
import toStyle from "css-to-style";
import useFitText from "use-fit-text";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { useState } from "react";

function Text({ obj, addFixedData, goal }) {
    const [fixed, setFixed] = useState();
    console.log(obj);
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
    const { fontSize, ref } = useFitText({ maxFontSize: goal });
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
    flex: 1 1 100%;
    cursor: pointer;
    min-height: 20px;
    background-color: white;
    box-sizing: border-box;
    visibility: ${(props) => (props.fixed ? "hidden" : "visiable")};
    display: flex;
`;

export default Text;
