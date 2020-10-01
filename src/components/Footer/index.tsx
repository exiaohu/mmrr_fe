import React from 'react';
import {GithubOutlined} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2020 胡箫的毕业设计"
    links={[
      {
        key: 'github',
        title: <GithubOutlined/>,
        href: 'https://github.com/exiaohu/mmrr_fe',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);
