import { useState } from 'react';
import styles from './FoldCard.module.scss';
import { IProps } from './FoldCard.model';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

function FoldCard(props: IProps) {
  const { title, children, operate, className, titleIcon, defaultDisplay = 'block' } = props;
  const [carConDisplay, setCarConDisplay] = useState(defaultDisplay);
  const isShowCon = (e: A) => {
    e.stopPropagation();
    const str = carConDisplay === 'block' ? 'none' : 'block';
    setCarConDisplay(str);
  };
  const newClass = className ? className : '';
  return (
    <div className={styles.Card}>
      <div className="card-header" onClick={isShowCon}>
        <div className="card-left">
          <div className="cardTitle">{title}</div>
          {titleIcon && <div style={{ marginLeft: '0.5rem' }}>{titleIcon}</div>}
        </div>
        <div className="card-right pr-8">
          {operate ? operate : ''}
          {carConDisplay === 'block' ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>
      <div className={`card-con ${newClass}`} style={{ display: carConDisplay }}>
        {children}
      </div>
    </div>
  );
}

export default FoldCard;
