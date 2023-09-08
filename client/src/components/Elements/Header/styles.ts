import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeaderContainer = styled.div`
  background-color: var(--primary-color);
  height: 75px;
  display: flex;
  align-items: center;
`;

export const Header = styled.div`
  max-width: 1800px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 40px;
    height: 40px;
    border-radius: var(--default-br);
  }
`;

export const AuthUserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export const BalanceContainer = styled.div`
  display: flex;
`;

export const BalanceDisplayContainer = styled.div`
  background-color: #3d3d3d;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: var(--default-br);
`;

export const BalanceAndIcon = styled.div`
  font-size: var(--default-fs);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 15px;
`;

export const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const MenuButton = styled(Link)`
  display: flex;
  align-items: center;
  color: white;
  height: 100%;
  padding: 0 20px;

  &:hover {
    background-color: rebeccapurple;
  }
`;
