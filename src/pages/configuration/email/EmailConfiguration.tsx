import { SettingOutlined } from '@ant-design/icons';
import DataTable from './components/DataTable';
import styles from './EmailConfiguation.module.scss';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '../../../components/breadcrum/Breadcrum';
import { useRef, useEffect } from 'react';
import Panel from './components/Panel';
import { Menu, MenuProps, Row } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';

const draftEmail = [
  {
    title: 'Test email',
    description: 'N/A',
    updatedDate: '2012/12/12 12:12:12',
    status: 'Active',
    modifiedBy: 'Sen'
  }
];
function EmailConfiguration() {
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();
  const panelRef = useRef();

  useEffect(() => {
    setBreadcrumb([
      { icon: <SettingOutlined />, text: `${t('configuration')}` },
      { text: `${t('Configuration_File')}` }
    ]);
  }, [t]);

  const openPanel = (data?: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  const items: MenuProps['items'] = [
    {
      label: 'Option 1',
      key: '1'
    },
    {
      label: 'Option 2',
      key: '2'
    }
  ];

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean']
    ]
  };

  return (
    <div className={styles.emailConfiguration}>
      {/* <DataTable data={draftEmail} openPanel={openPanel} /> */}
      <Panel refreshList={() => console.log('refresh')} ref={panelRef} />
      <Row className={styles.row}>
        <Menu onClick={onClick} style={{ width: 256 }} mode="inline" items={items} className={styles.leftNav} />
        <div className={styles.quill}>
          <ReactQuill theme="snow" modules={modules} />
        </div>
      </Row>
    </div>
  );
}

export default EmailConfiguration;
