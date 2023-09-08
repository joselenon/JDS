import styled from 'styled-components';

export const ProfileInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;

  h2 {
    font-size: 2.5rem;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;

export const ProfileContainer = styled.div`
  display: flex;
  height: 100%;
  gap: 1rem;
`;

export const AvatarContainer = styled.div`
  min-width: 6rem;
  height: 6rem;
`;

export const UserLevelContainer = styled.div`
  width: 100%;
  height: auto;
  line-height: 40px;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-direction: column;
`;

export const UsernameContainer = styled.div`
  height: 2.5rem;
  overflow: hidden;
`;

// FORM
export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: var(--primary-color);
  padding: 13px;
  border-radius: var(--default-br);
`;

export const InputsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  color: white;
`;

export const SaveButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: var(--default-btn-mt);
`;
//
