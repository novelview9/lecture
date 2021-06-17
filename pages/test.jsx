import styled from "styled-components";
import { useState } from "react";

import Content from "../components/Content";
import input from "../example_input.json";

const Main = ({ status }) => {
    const content = input.content;
    return content.map((data, index) => {
        return (
            <Container>
                <Content key={index} data={data} />
            </Container>
        );
    });
};
const Container = styled.div`
    width: 500px;
    height: 500px;
    background-color: red;
    padding: 10px;
`;

export default Main;
