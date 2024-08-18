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

export const SelectedFilesContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;

  ul {
    overflow: scroll;
  }
`;

export const FilesListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;

  h3 {
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
