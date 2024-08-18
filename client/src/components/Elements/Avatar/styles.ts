import styled from 'styled-components';

interface IAvatarContainerProp {
  $imageLoaded: boolean;
}

export const AvatarContainer = styled.div<IAvatarContainerProp>`
  display: flex;
  width: 100%;
  height: 100%;

  img {
    display: ${(props) => (props.$imageLoaded ? 'flex' : 'none')};
    height: 100%;
    border-radius: var(--default-br);
  }
`;
