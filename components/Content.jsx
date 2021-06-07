import shortid from "shortid";
import toStyle from "css-to-style";
import styled, { css } from "styled-components";
import { useState } from "react";

import Image from "./Image";
import Text from "./Text";

function Content({ data, withVideo }) {
    const [fixed, setFixed] = useState(false);
    if (!data) {
        return <Container isFull={!withVideo}></Container>;
    }
    const { images, textContainers } = data;
    return (
        <Container isFull={!withVideo}>
            {images && images.map(({ url, style, xy }, index) => <Image url={url} style={style} xy={xy} key={shortid.generate()} />)}
            {textContainers && textContainers.map(({ label, style, xy }, index) => <Text style={style} xy={xy} label={label} key={shortid.generate()} />)}
        </Container>
    );
}

const Container = styled.div`
    background-color: gray;
    > div {
        margin: 20px;
    }
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    @media only screen and (max-width: 900px) {
        > div {
            margin: 5px;
        }
    }

    width: 80%
        ${(props) =>
            props.isFull &&
            css`
                width: 100%;
            `};
`;

export default Content;
