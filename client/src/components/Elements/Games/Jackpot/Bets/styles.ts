import styled from 'styled-components';

export const BetsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 20px;
  flex-wrap: wrap;
  background-color: var(--secondary-color);
  padding: var(--default-pdn);
  border-radius: var(--default-br);

  @media (max-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 550px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export const BetInfo = styled.div`
  &.show {
    opacity: 1;
  }

  z-index: 1;
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  will-change: opacity;
  padding: 5px 10px;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  border-radius: var(--default-br);
  background-color: rgb(0, 0, 0, 0.8);
  transition: all 0.2s;

  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h2 {
    color: white;
    font-size: 12px !important;
    line-height: 15px !important;
  }
`;

export const AvatarContainer = styled.div`
  display: flex;
  position: relative;
`;

export const BetContainer = styled.div`
  position: relative;
  display: flex;
  gap: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: var(--default-br);

  img {
    height: 70px;
    box-shadow: var(--default-bshadow);
    border-radius: var(--default-br);
  }

  h2 {
    max-width: 100%;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 20px;
  }
`;

export const PageButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  gap: 0.5rem;
  margin-top: 0.25rem;

  button {
    width: 50%;
  }
`;

export const BetSkeletonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;

  div {
    border-radius: var(--default-br);
  }
`;
