import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Button = () => {
  return (
    <StyledButton >btn Test</StyledButton>
  )
};

export default Button;
