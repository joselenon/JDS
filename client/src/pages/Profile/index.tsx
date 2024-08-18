import React from 'react';

import ProfileInfo from '../../components/Sections/ProfileInfo';
import Button from '../../components/Elements/Button';
import useLogout from '../../hooks/useLogout';

export default function Profile() {
  const handleLogout = useLogout();

  return (
    <div className="main-wrapper">
      <ProfileInfo />
      <Button btnType="DANGER" label="Sair" attributes={{ onClick: handleLogout }} />
    </div>
  );
}
