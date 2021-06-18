import _ from "lodash";
import toStyle from "css-to-style";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { useState } from "react";

function Text({ content }) {
    const [fixed, setFixed] = useState();
    const onClick = () => {
        setFixed(true);
    };
    return (
        <Container fixed={fixed} onClick={onClick}>
            <TextEl>{content}</TextEl>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    cursor: pointer;
    min-height: 20px;
    background-color: white;
    padding: 5px;
    visibility: ${(props) => (props.fixed ? "hidden" : "visiable")};
`;
const TextEl = styled.p`
    /* font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")}; */
    font-size: 2vw;
    max-width: 100%;
    z-index: 200;
    /* @media only screen and (max-width: 900px) {
        font-size: 15px;
    } */
`;

export default Text;
