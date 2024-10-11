/* eslint-disable react/prop-types */
import styled from "styled-components"

const Container = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    min-height: calc(100vh - 60px);
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`

const BaseLayout = ({ children }) => {
    return (
        <Container>
            {children}
        </Container>
    )
}

export default BaseLayout