import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, notification, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { util } from '@/common/helpers/util';
import ImgCrop from 'antd-img-crop';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import { useTranslation } from 'react-i18next';

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
  const [fileAccept, setFileAccept] = useState<A>();
  const [imageUrl, setImageUrl] = useState<string>(imageLink);
  const { t } = useTranslation();

  useEffect(() => {
    getFileConfig();
  }, []);

  const getFileConfig = async () => {
    try {
      setLoading(true);
      const result = await service.globalSettingsService.getByType(1);
      setFileAccept(result.detail.filter((x: A) => x.title === 'Avatar')[0]);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const onModalOk = async (value: A) => {
    try {
      showLoading();
      const formData = new FormData();
      formData.append('file', value, value.name);
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
  };

  const fileProps: UploadProps = {
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

  const beforeUpload = async (file: RcFile) => {
    try {
      const type = fileAccept.fileAccept.split(', ').includes(file.type.split('/')[1]);
      if (!type) {
        notification.open({
          message: t(`You can only upload ${fileAccept.fileAccept} file!`),
          type: 'error'
        });
        return Upload.LIST_IGNORE;
      }

      const size = file.size < fileAccept.fileSize * 1024 * 1024;
      if (!size) {
        notification.open({
          message: t(`Image must be smaller than ${fileAccept.fileSize}MB!`),
          type: 'error'
        });
        return Upload.LIST_IGNORE;
      }

      return true;
    } catch (error) {
      console.error('Error during file validation:', error);
      return Upload.LIST_IGNORE;
    }
  };

  return (
    <>
      <ImgCrop rotationSlider zoomSlider showGrid onModalOk={onModalOk} beforeCrop={beforeUpload}>
        <Upload
          {...fileProps}
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          onChange={handleChange}
          accept="jpg"
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
