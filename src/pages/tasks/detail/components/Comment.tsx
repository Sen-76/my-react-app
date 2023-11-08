/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { util } from '@/common/helpers/util';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, List, Modal, Row, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import { useState } from 'react';
import { useLoading } from '@/common/context/useLoading';

const initDataGrid: Common.IDataGrid = {
  pageInfor: {
    pageSize: 10,
    pageNumber: 1,
    totalItems: 20
  },
  searchInfor: {
    searchValue: '',
    searchColumn: []
  }
  // filter: [{ key: 'Status', value: [EState.Activate, EState.DeActivate] }]
};
function Comment() {
  const { t } = useTranslation();
  const avatar = localStorage.getItem('avatar');
  const user = JSON.parse(sessionStorage.getItem('userDetail') ?? '');
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const { showLoading, closeLoading } = useLoading();
  const [addComment, setAddComment] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<A>();
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean']
    ]
  };
  const data = [
    {
      id: '1',
      title: 'Ant Design Title 1'
    },
    {
      id: '2',
      title: 'Ant Design Title 2'
    },
    {
      id: '3',
      title: 'Ant Design Title 3'
    },
    {
      id: '4',
      title: 'Ant Design Title 4'
    }
  ];

  const onAddComment = async (val: A) => {
    try {
      showLoading();
      form.resetFields();
      console.log(val);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const onEditComment = async () => {
    try {
      showLoading();
      console.log(editComment);
      setEditComment({});
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const handleTableChange = (pagination: A) => {
    console.log(pagination);
  };

  const deleteComment = async (comment: A) => {
    confirm({
      content: t('Comment_Delete_Remind_Text').replace('{0}', comment.title),
      title: t('Common_Delete'),
      okText: t('Common_Delete'),
      cancelText: t('Common_Cancel'),
      onOk() {
        confirmDelete(comment.id);
      }
    });
  };

  const confirmDelete = async (id: string) => {
    try {
      showLoading();
      console.log(id);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  return (
    <>
      <Row style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
        <Avatar size={44} src={avatar} style={{ marginRight: 10, backgroundColor: util.randomColor() }}>
          {user.fullName?.charAt(0)}
        </Avatar>
        {!addComment ? (
          <Col style={{ width: 'calc(100% - 60px)' }}>
            <Button
              style={{ width: '100%' }}
              onClick={() => {
                setEditComment('');
                setAddComment(true);
              }}
            >
              <span style={{ width: '100%', display: 'flex' }}>{t('Task_Add_Comment')}</span>
            </Button>
          </Col>
        ) : (
          <Col style={{ width: 'calc(100% - 60px)' }}>
            <Form form={form} onFinish={onAddComment}>
              <Form.Item name="comment">
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  style={{ display: 'flex', flexDirection: 'column', height: 150 }}
                />
              </Form.Item>
              <Button style={{ marginTop: 10, fontWeight: 600 }} type="primary" htmlType="submit">
                {t('Common_Send')}
              </Button>
              <Button
                style={{ marginTop: 10, fontWeight: 600 }}
                type="text"
                onClick={() => {
                  setAddComment(false);
                  form.resetFields();
                }}
              >
                {t('Common_Cancel')}
              </Button>
            </Form>
          </Col>
        )}
      </Row>
      <>
        <List
          pagination={{
            current: param.pageInfor!.pageNumber,
            pageSize: param.pageInfor!.pageSize,
            total: param.pageInfor!.totalItems,
            simple: false,
            onChange: (page) => handleTableChange(page)
          }}
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              {editComment?.id !== item?.id ? (
                <>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={44}
                        src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                        style={{ marginRight: 10, backgroundColor: util.randomColor() }}
                      >
                        {user.fullName?.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <div style={{ display: 'flex' }}>
                        <div>{item.title}</div>
                        <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 14, marginLeft: 20 }}>10 Jan 2099</div>
                      </div>
                    }
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                  <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditComment(item);
                      }}
                    />
                  </Tooltip>
                  <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
                    <Button type="text" onClick={deleteComment} icon={<DeleteOutlined />} />
                  </Tooltip>
                </>
              ) : (
                <Row style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 50, width: '100%' }}>
                  <Avatar size={44} src={avatar} style={{ marginRight: 10, backgroundColor: util.randomColor() }}>
                    {user.fullName?.charAt(0)}
                  </Avatar>
                  <Col style={{ width: 'calc(100% - 50px)' }}>
                    <ReactQuill
                      value={editComment.title}
                      theme="snow"
                      modules={modules}
                      style={{ display: 'flex', flexDirection: 'column', height: 150 }}
                      onChange={(value) => setEditComment({ ...editComment, title: value })}
                    />
                    <Button style={{ marginTop: 10 }} onClick={() => setEditComment({})}>
                      {t('Common_Cancel')}
                    </Button>
                    <Button style={{ marginTop: 10 }} type="primary" onClick={onEditComment}>
                      {t('Common_Send')}
                    </Button>
                  </Col>
                </Row>
              )}
            </List.Item>
          )}
        />
      </>
    </>
  );
}

export default Comment;
