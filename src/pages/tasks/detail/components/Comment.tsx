/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { util } from '@/common/helpers/util';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, List, Modal, Row, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import { useState } from 'react';
import { useLoading } from '@/common/context/useLoading';
import dayjs from 'dayjs';
import styles from '../TaskDetail.module.scss';
import { service } from '@/services/apis';
import { useParams } from 'react-router';

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
interface IProps {
  commentList: A[];
  refreshCommentList: () => void;
}
function Comment(props: Readonly<IProps>) {
  const { commentList, refreshCommentList } = props;
  const data = useParams();
  const { t } = useTranslation();
  const avatar = localStorage.getItem('avatar');
  const user = JSON.parse(sessionStorage.getItem('userDetail') ?? '{}');
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

  const onAddComment = async (val: A) => {
    try {
      showLoading();
      form.resetFields();
      await service.commentService.add({ ...val, userId: user.id, taskId: data.id ?? '' });
      refreshCommentList();
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
    <div className={styles.comment}>
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
              <Form.Item name="conttent">
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
      <List
        pagination={{
          current: param.pageInfor!.pageNumber,
          pageSize: param.pageInfor!.pageSize,
          total: param.pageInfor!.totalItems,
          simple: false,
          onChange: (page) => handleTableChange(page)
        }}
        dataSource={commentList}
        renderItem={(item) => (
          <List.Item>
            {editComment?.id !== item?.id ? (
              <>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={44}
                      src={item.author?.avatarUrl.url ?? ''}
                      style={{ marginRight: 10, backgroundColor: util.randomColor() }}
                    >
                      {item.author?.fullName?.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <div style={{ display: 'flex' }}>
                      <div>{item.author?.fullName}</div>
                      <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 14, marginLeft: 20 }}>
                        {dayjs(item.createdDate).format('DD MMM YYYY HH:mm')}
                      </div>
                    </div>
                  }
                  description={
                    <div className="ql-editor" style={{ width: '100%', padding: 0 }}>
                      <div dangerouslySetInnerHTML={{ __html: item?.conttent }} />
                    </div>
                  }
                />
                {user?.id === item.user?.id && (
                  <>
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
                )}
              </>
            ) : (
              <Row style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 50, width: '100%' }}>
                <Avatar
                  size={44}
                  src={item.user?.avatar ?? ''}
                  style={{ marginRight: 10, backgroundColor: util.randomColor() }}
                >
                  {user.fullName?.charAt(0)}
                </Avatar>
                <Col style={{ width: 'calc(100% - 50px)' }}>
                  <ReactQuill
                    value={editComment.conttent}
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
    </div>
  );
}

export default Comment;
