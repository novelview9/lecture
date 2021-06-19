import _ from "lodash";
import styled from "styled-components";
import React, { useState } from "react";
import { Rnd } from "react-rnd";

function Image({ url, addFixedData }) {
    const [fixed, setFixed] = useState();
    const onClick = (e) => {
        setFixed(true);
        const { top, right, bottom, left, width, height, x, y } = e.currentTarget.getBoundingClientRect();
        addFixedData({
            label: e.target.tagName,
            text: e.target.InnerHTML,
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
    return (
        <Container fixed={fixed} onClick={onClick}>
            <Img src={url} draggable="false" />;
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    max-height: 20vh;
    visibility: ${(props) => (props.fixed ? "hidden" : "visible")};
`;
const Img = styled.img`
    width: inherit;
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
    object-fit: contain;
    height: inherit;
    max-height: inherit;
    @media only screen and (max-width: 900px) {
        max-width: 50%;
    }
`;

export default React.memo(Image);
