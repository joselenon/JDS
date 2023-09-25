import styled from 'styled-components';

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h3 {
    font-family: var(--bai-font);
    font-size: 14px;
  }

  input {
    width: 100%;
    height: 37px;
    font-family: var(--bai-font);
    background-color: #3d3d3d;
    border-radius: var(--default-br);
    padding: var(--default-pdn) 5px;
    color: white;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 14px;
  color: red;
`;
