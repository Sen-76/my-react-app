import { SettingOutlined } from '@ant-design/icons';
import styles from './EmailConfiguation.module.scss';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '../../../components/breadcrum/Breadcrum';
import { useEffect, useState } from 'react';
import { Button, Menu, MenuProps, Row } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';

function EmailConfiguration() {
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();
  const { showLoading, closeLoading } = useLoading();
  const [menuItem, setMenuItem] = useState<MenuProps['items']>();
  const [quillValue, setQuillValue] = useState<A>();

  useEffect(() => {
    setBreadcrumb([
      { icon: <SettingOutlined />, text: `${t('configuration')}` },
      { text: `${t('Configuration_File')}` }
    ]);
  }, [t]);

  useEffect(() => {
    getTemplateList();
  }, []);

  const getTemplateList = async () => {
    try {
      showLoading();
      await service.globalSettingsService.getAllEmailTemplate();
      setMenuItem([
        {
          label: 'Option 1',
          key: '1'
        },
        {
          label: 'Option 2',
          key: '2'
        }
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const onClick: MenuProps['onClick'] = async (e) => {
    try {
      showLoading();
      await service.globalSettingsService.getAllEmailTemplateById(e.key as string);
      setQuillValue('<div>Test</div>');
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const updateEmailTemplate = () => {
    console.log('a');
  };

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
      <Row className={styles.row}>
        <Menu onClick={onClick} style={{ width: 256 }} mode="inline" items={menuItem} className={styles.leftNav} />
        <div className={styles.quill}>
          <ReactQuill theme="snow" modules={modules} value={quillValue} />
        </div>
      </Row>
      <div className="actionBtnBottom">
        <Button type="primary" htmlType="submit" onClick={updateEmailTemplate}>
          {t('Common_Confirm')}
        </Button>
      </div>
    </div>
  );
}

export default EmailConfiguration;
