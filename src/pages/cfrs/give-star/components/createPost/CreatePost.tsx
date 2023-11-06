import { Button, Empty, Form, Input, Row, Select, Slider, Spin, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from '../../GiveStar.module.scss';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';

interface IProps {
  numberStar: number;
}

function CreatePost(prop: IProps) {
  const [editData, setEditData] = useState<Post.IPostCreateModel>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [departmentList, setDepartmentList] = useState<A>([]);
  const [userList, setUserList] = useState<A>([]);
  const [customAlert, setCustomAlert] = useState<A>();
  const { showLoading, closeLoading } = useLoading();
  const [selectLoading, setSelectLoading] = useState<boolean>();

  const getDepartmentList = async () => {
    try {
      const result = await service.departmentService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setDepartmentList([
        { label: t('Common_All_Department'), value: null },
        ...result.data.map((department: A) => ({
          label: department.title,
          value: department.id
        }))
      ]);
      setSelectLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  const handleGetUser = async () => {
    if (form.getFieldValue('department')) {
      await getUser(form.getFieldValue('department'));
    } else {
      await getUser();
    }
  };
  const getUser = async (departmentId?: string) => {
    try {
      const result = await service.accountService.getAccount({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        },
        filter: departmentId != null ? [{ key: 'userDepartment', value: [departmentId] }] : null
      });
      setUserList([
        ...result.data.map((team: A) => ({
          label: team.fullName,
          value: team.id
        }))
      ]);
      setSelectLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const onConfirm = async () => {
    try {
      const generalCheck = await form.validateFields();
      setEditData({ ...editData, ...form.getFieldsValue() });
      const systemCheck = await form.validateFields();
      if (generalCheck && systemCheck) {
        showLoading();
        await service.postService.createPost({
          ...editData,
          ...form.getFieldsValue()
        });
        notification.open({
          message: t('Common_CreateSuccess'),
          type: 'success'
        });
      }
    } catch (e: A) {
      if (e.response?.data.status === 422) {
        const errors: A = e.response.data.errors;
        setCustomAlert(errors);
      }
    } finally {
      closeLoading();
    }
  };

  function onAfterChange(value: A) {
    console.log('onAfterChange: ', value);
  }
  const formRule = {
    title: [{ required: true, message: t('Common_Require_Field') }],
    reciver: [{ required: true, message: t('Common_Require_Field') }],
    starSend: [{ required: true, message: t('Common_Require_Field') }],
    content: [{ required: true, message: t('Common_Require_Field') }]
  };

  return (
    <>
      <Row className={styles.header}>
        <span>{t('CFRs_Create_Label_Entry')}</span>
      </Row>
      <div className={styles.body}>
        <Form layout="vertical" form={form}>
          <Form.Item name="department">
            <Select
              showSearch
              defaultValue={{ label: t('Common_All_Department'), value: null }}
              style={{ width: '100%' }}
              placeholder={t('CFRs_Select_Department_Placeholder')}
              onClick={() => {
                getDepartmentList();
                setSelectLoading(true);
              }}
              options={departmentList}
              notFoundContent={
                selectLoading ? (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 100
                    }}
                  >
                    <Spin />
                  </div>
                ) : (
                  <Empty />
                )
              }
            />
          </Form.Item>
          <Form.Item label={t('CFRs_Title_Entry')} name="title" rules={formRule.title}>
            <Input />
          </Form.Item>
          <Form.Item label={t('CFRs_Receiver_Entry')} name="userGive" rules={formRule.reciver}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder={t('CFRs_SelectReceiver_Placeholder')}
              onClick={() => {
                setUserList([]);
                handleGetUser();
                setSelectLoading(true);
              }}
              options={userList}
              notFoundContent={
                selectLoading ? (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 100
                    }}
                  >
                    <Spin />
                  </div>
                ) : (
                  <Empty />
                )
              }
            />
          </Form.Item>
          <Form.Item label={t('Number_Star_Send')} name="starGive" rules={formRule.starSend}>
            <Slider defaultValue={0} onAfterChange={onAfterChange} max={prop.numberStar < 0 ? 0 : prop.numberStar} />
          </Form.Item>
          <Form.Item label={t('CFRs_Content_Entry')} name="description" rules={formRule.content}>
            <TextArea placeholder="Autosize height based on content lines" autoSize />
          </Form.Item>
          <div className="actionBtnBottom">
            <Button type="primary" htmlType="submit" onClick={onConfirm}>
              {t('Common_Send')}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default CreatePost;
