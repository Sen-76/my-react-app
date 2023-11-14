import { KeyResultPriority, OKRStatus } from '@/common/enum/okr.enum';
import { IOKRModel } from '@/services/models/OKR';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Collapse,
  DatePicker,
  Drawer,
  Flex,
  Form,
  FormInstance,
  Input,
  Progress,
  Select,
  Slider,
  Space
} from 'antd';
import { getOkrProgress, keyResultrPriorityOptions, okrStatusOptions } from '../okrs.util';
type OKRFormDrawerProps = {
  open: boolean;
  title: string;
  form: FormInstance;
  onClose: () => void;
  onFinish: (values: IOKRModel) => void;
};

export function OKRFormDrawer({ open, title, form, onClose, onFinish }: OKRFormDrawerProps) {
  const keyResults = Form.useWatch('keyResults', form);

  return (
    <Drawer
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <Flex justify="end">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={form.submit}>
            Save
          </Button>
        </Flex>
      }
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          label="Objective title"
          name="title"
          rules={[{ required: true, message: 'Objective title is required!' }]}
        >
          <Input type="text" placeholder="Objective title" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea title="Description" placeholder="Description" />
        </Form.Item>

        <Flex justify="space-between">
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: 'Start date is required!' }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item label="Due Date" name="endDate">
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
        </Flex>

        <Form.Item label="Progress">
          <Progress percent={getOkrProgress(keyResults)} />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Status is required!' }]}
          initialValue={OKRStatus.NOT_STARTED}
        >
          <Select options={okrStatusOptions} />
        </Form.Item>

        <Form.List
          name="keyResults"
          rules={[
            {
              validator: async (_, keyResults) => {
                if (!keyResults || !keyResults.length) {
                  return Promise.reject(new Error('At least 1 key results required'));
                }
              }
            }
          ]}
        >
          {(fields, { add, remove }) => (
            <Collapse
              ghost
              bordered={false}
              defaultActiveKey={['1']}
              items={[
                {
                  key: '1',
                  label: 'Key result',
                  extra: (
                    <Space.Compact>
                      <Button
                        type="text"
                        size="small"
                        icon={<PlusOutlined />}
                        style={{ paddingTop: 0, paddingBottom: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          add();
                        }}
                      >
                        Add key result
                      </Button>
                    </Space.Compact>
                  ),
                  children: (
                    <>
                      {fields.map(({ key, name, ...restField }, id) => (
                        <fieldset key={key} style={{ position: 'relative' }}>
                          <legend>Key result {id + 1}</legend>

                          <Button
                            danger
                            type="primary"
                            size="small"
                            onClick={() => remove(name)}
                            style={{ position: 'absolute', top: -50, right: 0, paddingTop: 0, paddingBottom: 0 }}
                          >
                            Delete
                          </Button>

                          <Form.Item
                            {...restField}
                            label="Title"
                            name={[name, 'title']}
                            rules={[{ required: true, message: 'Title is required!' }]}
                          >
                            <Input type="text" placeholder="Title" />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'planLink']}
                            label="Link plan"
                            rules={[{ type: 'url', message: 'Link plan must be a url!' }]}
                          >
                            <Input type="url" placeholder="Link plan" />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'progress']}
                            label="Progress"
                            rules={[{ required: true, message: 'Progress is required!' }]}
                            initialValue={0}
                          >
                            <Slider max={100} tooltip={{ formatter: (value) => value + '%' }} />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'priority']}
                            label="Priority"
                            rules={[{ required: true, message: 'Priority is required!' }]}
                            initialValue={KeyResultPriority.UNKNOWN}
                          >
                            <Select options={keyResultrPriorityOptions} />
                          </Form.Item>
                        </fieldset>
                      ))}
                    </>
                  )
                }
              ]}
            />
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
}
