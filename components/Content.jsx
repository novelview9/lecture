import React from "react";
import shortid from "shortid";
import toStyle from "css-to-style";
import styled, { css } from "styled-components";
import { Rnd } from "react-rnd";
import { useState } from "react";

import Image from "./Image";
import Text from "./Text";

const sourcePath = "/example_input1_source/";

const ChunkedData = ({ data }) => {
    return (
        // <p>{`${data}`}</p>
        <>
            {data.map((obj) => {
                if (obj.label === "text_box") {
                    return <Text content={obj.text_content} />;
                } else if (obj.label === "video") {
                    return <Text>{obj.text_content}</Text>;
                } else {
                    return <Image url={`${sourcePath}${obj.path}`} />;
                }
            })}
        </>
    );
};

const RndElement = ({ data }) => {
    return (
        <Rnd>
            <p>{`${data}`}</p>
        </Rnd>
    );
};

function Content({ data, withVideo }) {
    const column = data.column;
    const chunkedData = _.groupBy(data.learning_material, "in_column");
    const titleObj = _.find(data.learning_material, (o) => o.label === "title");
    const [fixed, setFixed] = useState(false);
    if (!data) {
        return <Container isFull={!withVideo}></Container>;
    }
    const { images, textContainers } = data;
    const [num, setNum] = useState(0);
    const addNum = () => {
        setNum(num + 1);
    };
    return (
        <Container isFull={!withVideo}>
            {_.times(column, (i) => {
                return (
                    <Column key={shortid.generate()}>
                        <ChunkedData data={chunkedData[i + 1]} key={shortid.generate()} />
                    </Column>
                );
            })}
            {/* {images && images.map(({ url, style, xy }, index) => <Image url={url} style={style} xy={xy} key={shortid.generate()} />)}
            {textContainers && textContainers.map(({ label, style, xy }, index) => <Text style={style} xy={xy} label={label} key={shortid.generate()} />)} */}
        </Container>
    );
}
const Info = styled.p`
    font-size: 200px;
`;
const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const Container = styled.div`
    background-color: gray;
    > div {
        padding: 20px;
    }
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    @media only screen and (max-width: 900px) {
        > div {
            padding: 2px;
        }
    }

    width: 80%
        ${(props) =>
            props.isFull &&
            css`
                width: 100%;
            `};
`;

export default React.memo(Content);
