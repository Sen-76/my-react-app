import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { util } from '@/common/helpers/util';
import ImgCrop from 'antd-img-crop';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

interface IProps {
  imageLink: string;
  name: string;
  id: string;
  refreshList: () => void;
}
const EditAvatar = (props: IProps) => {
  const { showLoading, closeLoading } = useLoading();
  const { imageLink, name } = props;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(imageLink);

  const fileProps: UploadProps = {
    beforeUpload: async (file: A) => {
      try {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
          closeLoading();
          return;
        }
        showLoading();
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('outletId', 'la cai d gi');
        formData.append('comment', 'comment làm cái đúng gì');
        formData.append('id', props.id.toString());
        await service.accountService.uploadAvatar(formData);
        props.refreshList();
      } catch (e) {
        console.log(e);
      } finally {
        closeLoading();
      }
    },
    showUploadList: false
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div style={{ position: 'absolute' }}>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <ImgCrop rotationSlider>
        <Upload
          {...fileProps}
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          onChange={handleChange}
        >
          {imageUrl ? (
            <>
              <Avatar
                src={imageUrl ?? imageLink}
                style={{ width: '100%', height: '100%', backgroundColor: util.randomColor(), position: 'absolute' }}
              >
                {name?.charAt(0) ?? 'N/A'}
              </Avatar>
            </>
          ) : (
            uploadButton
          )}
        </Upload>
      </ImgCrop>
    </>
  );
};

export default EditAvatar;
