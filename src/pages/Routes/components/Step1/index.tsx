import React, { useState } from 'react';
import { Form, Button, Input, Checkbox, Row, Col, Table, Space, Modal, Select } from 'antd';
import styles from '../../Create.less';

import PanelSection from '../PanelSection';

const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const Step1: React.FC<RoutesModule.StepProps> = ({ data, onChange }) => {
  const { step1Data } = data;
  const { hosts, paths, advancedMatchingRules } = step1Data;
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalData, setEditModalData] = useState<RoutesModule.MatchingRule>({
    paramsLocation: 'query',
    paramsName: '',
    paramsExpresstion: '==',
    paramsValue: '',
    key: '',
  });

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleEdit = (record: RoutesModule.MatchingRule) => {
    setEditModalData(record);
    requestAnimationFrame(() => {
      setModalVisible(true);
    });
  };

  const handleRemove = (key: string) => {
    const filteredAdvancedMatchingRules = advancedMatchingRules.filter((item) => item.key !== key);
    onChange({ advancedMatchingRules: filteredAdvancedMatchingRules });
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
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RoutesModule.MatchingRule) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleRemove(record.key)}>移除</a>
        </Space>
      ),
    },
  ];

  const addHost = () => {
    onChange({
      hosts: hosts.concat(''),
    });
  };

  const renderHosts = () =>
    hosts.map((item, index) => (
      <Row key={`${item + index}`} style={{ marginBottom: '10px' }} gutter={[16, 16]}>
        <Col span={16}>
          <Input placeholder="HOST" />
        </Col>
        <Col span={4}>
          <Space>
            {hosts.length > 1 && (
              <Button
                type="primary"
                danger
                onClick={() => {
                  onChange({ hosts: hosts.filter((_, _index) => _index !== index) });
                }}
              >
                删除
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    ));

  const renderPaths = () =>
    paths.map((item, index) => (
      <Row key={`${item + index}`} style={{ marginBottom: '10px' }} gutter={[16, 16]}>
        <Col span={16}>
          <Input placeholder="请输入 Path" />
        </Col>
        <Col span={4}>
          <Space>
            <Button
              type="primary"
              danger
              onClick={() => {
                onChange({ paths: paths.filter((_, _index) => _index !== index) });
              }}
            >
              删除
            </Button>
          </Space>
        </Col>
      </Row>
    ));

  const addPath = () => {
    onChange({
      paths: paths.concat(['']),
    });
  };

  const renderMeta = () => (
    <>
      <PanelSection title="名称及其描述">
        <Form {...formItemLayout} form={form} layout="horizontal" className={styles.stepForm}>
          <Form.Item
            label="API 名称"
            name="name"
            rules={[{ required: true, message: '请输入 API 名称' }]}
          >
            <Input placeholder="请输入 API 名称" />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <TextArea placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </PanelSection>
    </>
  );

  const renderBaseRequestConfig = () => (
    <>
      <PanelSection title="请求基础定义">
        <Form {...formItemLayout} form={form} layout="horizontal" className={styles.stepForm}>
          <Form.Item
            label="协议"
            name="protocol"
            rules={[{ required: true, message: '请勾选协议' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                {['HTTP', 'HTTPS', 'WebSocket'].map((item) => (
                  <Col span={6} key={item}>
                    <Checkbox value={item}>{item}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          {/* TODO: name */}
          <Form.Item label="HOST" rules={[{ required: true, message: '请输入 HOST' }]}>
            {renderHosts()}
            <Button
              type="primary"
              onClick={() => {
                addHost();
              }}
            >
              增加
            </Button>
          </Form.Item>
          {/* TODO: name */}
          <Form.Item label="PATH">
            {renderPaths()}
            <Button onClick={addPath} type="primary">
              增加
            </Button>
          </Form.Item>
          <Form.Item
            label="HTTP Methods"
            name="httpMethods"
            rules={[{ required: true, message: '请勾选 HTTP Methods' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                {['ANY', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'].map((item) => (
                  <Col span={6} key={item}>
                    <Checkbox value={item}>{item}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </PanelSection>
    </>
  );

  const [modalForm] = Form.useForm();
  const handleOk = () => {
    modalForm.validateFields().then((value) => {
      onChange({
        advancedMatchingRules: advancedMatchingRules.concat({
          ...(value as RoutesModule.MatchingRule),
          key: Math.random().toString(36).slice(2),
        }),
      });
      setModalVisible(false);
    });
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const renderAdvancedMatchingRules = () => (
    <>
      <PanelSection title="高级路由匹配条件">
        <div>
          <Button
            onClick={handleAdd}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            新增
          </Button>
          <Table key="table" bordered dataSource={advancedMatchingRules} columns={columns} />
        </div>
      </PanelSection>
    </>
  );

  return (
    <>
      {modalVisible && (
        <Modal title="新增" centered visible onOk={handleOk} onCancel={handleCancel} destroyOnClose>
          <Form
            form={modalForm}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            initialValues={editModalData}
          >
            <Form.Item
              label="参数位置"
              name="paramsLocation"
              rules={[{ required: true, message: '请选择参数位置' }]}
            >
              <Select>
                <Option value="header">header</Option>
                <Option value="query">query</Option>
                <Option value="params">params</Option>
                <Option value="cookie">cookie</Option>
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
      )}
      {renderMeta()}
      {renderBaseRequestConfig()}
      {renderAdvancedMatchingRules()}
    </>
  );
};

export default Step1;
