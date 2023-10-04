import React from 'react';
import { useSelector } from 'react-redux';
import { faGear } from '@fortawesome/free-solid-svg-icons';

import * as styles from './styles';

import IReduxStore from '../../../config/interfaces/IReduxStore';
import Avatar from '../../Elements/Avatar';
import InfoForm from './InfoForm';
import IconedSection from '../../Utils/IconedSection';
import UserAndLevel from './UserAndLevel';

export default function ProfileInfo() {
  const auth = useSelector((state: IReduxStore) => state.auth);

  return (
    <styles.ProfileInfoContainer>
      <styles.ProfileContainer>
        <styles.AvatarContainer>
          <Avatar />
        </styles.AvatarContainer>
        <UserAndLevel auth={auth} />
      </styles.ProfileContainer>
      <IconedSection icon={faGear} title="Configurações" Content={<InfoForm />} />
    </styles.ProfileInfoContainer>
  );
}
