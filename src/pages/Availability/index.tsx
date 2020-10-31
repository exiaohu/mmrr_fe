import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Image } from 'antd';

const MapView: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Image src="tmp/availability.png" />
      </Card>
    </PageContainer>
  );
};

export default MapView;
