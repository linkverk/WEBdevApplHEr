import React from 'react';
import Seats from '../../components/Seats';
import { getAppData } from "../../utils/storage";
import { useParams } from "react-router-dom";

const ScreeningRoom: React.FC = () => {
  const { fakeZalen } = getAppData();
  const { zaalId } = useParams();
  const zaal = fakeZalen.find((z) => z.id === zaalId) ?? fakeZalen[0];
  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '16px' }}>{zaal.naam}</h1>
       <Seats zaal={zaal} button={true}/>
    </div>
  );
};

export default ScreeningRoom;
