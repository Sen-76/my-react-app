import { util } from '@/common/helpers/util';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, List, Row, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';

function Comment() {
  const { t } = useTranslation();
  const avatar = localStorage.getItem('avatar');
  const user = JSON.parse(sessionStorage.getItem('userDetail') ?? '');
  console.log(user);
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
  return (
    <>
      <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Avatar size={40} src={avatar} style={{ marginRight: 10, backgroundColor: util.randomColor() }}>
          {user.fullName?.charAt(0)}
        </Avatar>
        <Col style={{ width: 'calc(100% - 50px)' }}>
          <ReactQuill
            theme="snow"
            modules={modules}
            style={{ display: 'flex', flexDirection: 'column', height: 150 }}
          />
          <Button style={{ marginTop: 10 }} type="primary">
            {t('Common_Send')}
          </Button>
        </Col>
      </Row>
      {/* <List
        itemLayout="horizontal"
        dataSource={datas}
        renderItem={(item) => (
          <List.Item key={item.title}>
            <div>
              <div>Description</div>
            </div>

            <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
              <Button type="text" onClick={() => console.log('cc')} icon={<EditOutlined />} />
              <Button type="text" onClick={() => console.log('cc')} icon={<DeleteOutlined />} />
            </Tooltip>
          </List.Item>
        )}
      /> */}
    </>
  );
}

export default Comment;
