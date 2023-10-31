import icons from '@/assets/icons';
import { Radio } from 'antd';

const IconPicker = ({ onChange }: A) => {
  return (
    <Radio.Group onChange={onChange}>
      {icons.map((icon) => (
        <Radio.Button key={icon.value} value={icon.value}>
          {icon.component}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default IconPicker;
