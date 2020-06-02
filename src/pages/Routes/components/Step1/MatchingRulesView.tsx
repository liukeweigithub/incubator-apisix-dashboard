import React, { useState } from 'react';
import { Button, Table, Modal, Form, Select, Input, Space } from 'antd';

import PanelSection from '../PanelSection';

interface Props extends RouteModule.Data {}

const MatchingRulesView: React.FC<Props> = ({ data, disabled, onChange }) => {
  const { advancedMatchingRules } = data.step1Data;

  const [visible, setVisible] = useState(false);

  const [mode, setMode] = useState<RouteModule.ModalType>('CREATE');
  const [modalForm] = Form.useForm();

  const { Option } = Select;

  const onOk = () => {
    modalForm.validateFields().then((value) => {
      if (mode === 'EDIT') {
        const key = modalForm.getFieldValue('key');
        onChange({
          ...data.step1Data,
          advancedMatchingRules: advancedMatchingRules.map((rule) => {
            if (rule.key === key) {
              return { ...(value as RouteModule.MatchingRule), key };
            }
            return rule;
          }),
        });
      } else {
        const rule = {
          ...(value as RouteModule.MatchingRule),
          key: Math.random().toString(36).slice(2),
        };
        onChange({ ...data.step1Data, advancedMatchingRules: advancedMatchingRules.concat(rule) });
      }
      modalForm.resetFields();
      setVisible(false);
    });
  };

  const handleEdit = (record: RouteModule.MatchingRule) => {
    setMode('EDIT');
    setVisible(true);
    modalForm.setFieldsValue(record);
  };

  const handleRemove = (key: string) => {
    onChange({
      ...data.step1Data,
      advancedMatchingRules: advancedMatchingRules.filter((item) => item.key !== key),
    });
  };

  const columns = [
    {
      title: '参数位置',
      dataIndex: 'paramsLocation',
      key: 'paramsLocation',
    },
    {
      title: '参数名称',
      dataIndex: 'paramsName',
      key: 'paramsName',
    },
    {
      title: '运算符',
      dataIndex: 'paramsExpresstion',
      key: 'paramsExpresstion',
    },
    {
      title: '参数值',
      dataIndex: 'paramsValue',
      key: 'paramsValue',
    },
    disabled
      ? {}
      : {
          title: '操作',
          key: 'action',
          render: (_: any, record: RouteModule.MatchingRule) => (
            <Space size="middle">
              <a onClick={() => handleEdit(record)}>编辑</a>
              <a onClick={() => handleRemove(record.key)}>删除</a>
            </Space>
          ),
        },
  ];

  const renderModal = () => {
    return (
      <Modal
        title={mode === 'EDIT' ? '编辑' : '增加'}
        centered
        visible={visible}
        onOk={onOk}
        onCancel={() => {
          setVisible(false);
          modalForm.resetFields();
        }}
        destroyOnClose
      >
        <Form form={modalForm} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item
            label="参数位置"
            name="paramsLocation"
            rules={[{ required: true, message: '请选择参数位置' }]}
          >
            <Select>
              <Option value="header">HTTP 请求头</Option>
              <Option value="arguments">请求参数</Option>
              <Option value="cookie">Cookie</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="参数名称"
            name="paramsName"
            rules={[{ required: true, message: '请输入参数名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="运算符"
            name="paramsExpresstion"
            rules={[{ required: true, message: '请选择运算符' }]}
          >
            <Select>
              <Option value="==">等于</Option>
              <Option value="～=">不等于</Option>
              <Option value=">">大于</Option>
              <Option value="<">小于</Option>
              <Option value="~~">正则匹配</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="值"
            name="paramsValue"
            rules={[{ required: true, message: '请输入参数值' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <PanelSection title="高级路由匹配条件">
      {!disabled && (
        <Button
          onClick={() => {
            setMode('CREATE');
            setVisible(true);
          }}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          增加
        </Button>
      )}
      <Table key="table" bordered dataSource={advancedMatchingRules} columns={columns} />
      {renderModal()}
    </PanelSection>
  );
};

export default MatchingRulesView;