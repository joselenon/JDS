import React from 'react';
import GiveawayItem from './GiveawayItem';

export default function GiveawayContainer() {
  const gi1 = (
    <GiveawayItem
      img={
        'https://firebasestorage.googleapis.com/v0/b/canaldosaullo-com.appspot.com/o/giveaways%2Fcovers%2FxXrKiwxMRogSC4mJFwio.png?alt=media&token=a5c3a5d5-a395-4b73-8386-3d77d2f7636b'
      }
      description="SORTEIO AK FIRE SERPENT + 1 GLOCK EMERALD + 10 FACAS GAMMA DOPPLER (R$65.000,00)"
    />
  );

  const gi2 = (
    <GiveawayItem
      img={
        'https://firebasestorage.googleapis.com/v0/b/canaldosaullo-com.appspot.com/o/giveaways%2Fcovers%2FaNz2FMejLCBRlcV4JVML.png?alt=media&token=bccf84a8-5043-480b-9e7b-88484f5c5502'
      }
      description="SORTEIO RELAMPAGO ★ Flip Knife | Case Hardened MW ST (Blue Gem)"
    />
  );

  return (
    <div>
      {gi1} {gi2}
    </div>
  );
}
