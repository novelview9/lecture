import _ from "lodash";
import styled from "styled-components";
import toStyle from "css-to-style";

function Image({ url, style, xy }) {
    const styleData = toStyle(style);
    const filteredStyle = _.omit(styleData, "width");
    const width = _.get(styleData, "width");

    return (
        <Container>
            <Img src={url} style={{ ...filteredStyle }} left={xy[0]} top={xy[1]} maxWidth={width} />;
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
`;
const Img = styled.img`
    width: inherit;
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
    object-fit: contain;
`;

export default Image;
