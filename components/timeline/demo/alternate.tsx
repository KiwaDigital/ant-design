import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Timeline } from 'antd';

const App: React.FC = () => (
  <Timeline
    mode="alternate"
    items={[
      {
        children: 'Jordan Koziol-Repia edited project "VoiceQ Demo" on Sun May 19 2024 09:37:56 GMT+0000',
      },
      {
        children: 'Jordan Koziol-Repia edited project "VoiceQ Demo" on Sun May 19 2024 10:37:56 GMT+0000',
        color: 'green',
      },
      {
        dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
        children: 'Jordan Koziol-Repia edited project "VoiceQ Demo" on Sun May 19 2024 11:37:56 GMT+0000',
      },
      {
        color: 'red',
        children: 'Yoon Ho Lim edited project "VoiceQ Demo" on Sun May 19 2024 12:37:56 GMT+0000',
      },
      {
        children: 'Jordan Koziol-Repia edited project "VoiceQ Demo" on Sun May 19 2024 15:37:56 GMT+0000',
      },
      {
        dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
        children: 'Adam Fu edited project "VoiceQ Demo" on Sun May 19 2024 16:37:56 GMT+0000',
      },
    ]}
  />
);

export default App;
