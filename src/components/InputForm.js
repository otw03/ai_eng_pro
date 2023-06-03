import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = () => {
  return (
    <>
      <Label></Label>    
      <Input></Input>
    </>
  )
};

export default Button;
