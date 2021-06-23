import _ from "lodash";
import styled from "styled-components";
import React, { useState } from "react";
import { Rnd } from "react-rnd";

function Image({ url, addFixedData }) {
    const [fixed, setFixed] = useState();
    const onClick = (e) => {
        setFixed(true);
        const { top, right, bottom, left, width, height, x, y } = e.currentTarget.firstChild.getBoundingClientRect();
        addFixedData({
            label: e.target.tagName,
            text: e.target.InnerHTML,
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
    return (
        <Container fixed={fixed} onClick={onClick}>
            <Img src={url} draggable="false" />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex: 1;
    flex-basis: 0;
    overflow: hidden;
    visibility: ${(props) => (props.fixed ? "hidden" : "visible")};
`;
const Img = styled.img`
    margin: 0 auto;
    max-width: 100%;
    max-height: 100%;
`;

export default React.memo(Image);
