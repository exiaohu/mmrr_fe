import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Card, Typography} from 'antd';
import styles from './Welcome.less';

const CodePreview: React.FC<{}> = ({children}) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      <Typography.Text strong>
        多模环境下的组合路径推荐{' '}
        <a rel="noopener noreferrer" target="__blank">
          欢迎使用
        </a>
      </Typography.Text>
      <CodePreview>some coding</CodePreview>
    </Card>
  </PageContainer>
);
