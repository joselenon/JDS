import styled from 'styled-components';

export const CarouselItem = styled.div`
  border-radius: var(--default-br);
  background-color: var(--primary-color);
  min-width: 250px;
`;

export const Picture = styled.div`
  width: 100%;
  height: 140px;
  border-radius: var(--default-br) var(--default-br) 0 0;

  img {
    border-radius: var(--default-br) var(--default-br) 0 0;
    width: 100%;
  }
`;

export const ItemDescription = styled.div`
  border-radius: 0 0 var(--default-br) var(--default-br);
  padding: var(--default-pdn) 15px;
  color: white;
  min-height: 85.5px;

  h3 {
    margin-bottom: 2.5px;
    border-radius: var(--default-br);
  }
`;

export const VideoDescription = styled.span`
  margin-top: 0.25rem;
  font-family: var(--bai-font);
  font-size: 16px;
  max-height: 40px;
  line-height: 18px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const Channel = styled.div`
  display: flex;
  gap: 0.5rem;

  img {
    border-radius: var(--default-br);
  }
`;
