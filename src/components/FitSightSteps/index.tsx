import React, { useState } from 'react';
import { Modal, Radio, Button, Upload, message } from 'antd';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload';
import Home from '../../pages/Home';

const FitSightSteps: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState<'Nam' | 'Nữ' | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadFile[]>([]);
  const [trainingGroup, setTrainingGroup] = useState<'Gym' | 'Workout' | null>(null);
  const [finished, setFinished] = useState(false);

  const totalSteps = 4;

  const next = () => {
    if (currentStep === 1 && !gender) {
      message.error('Vui lòng chọn giới tính trước khi tiếp tục.');
      return;
    }
    if (currentStep === 2 && uploadedImages.length === 0) {
      message.error('Vui lòng tải lên ít nhất một bức ảnh.');
      return;
    }
    if (currentStep === 3 && !trainingGroup) {
      message.error('Vui lòng chọn nhóm luyện tập.');
      return;
    }

    if (currentStep === totalSteps - 1) {
      setVisible(false);
      setFinished(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const uploadProps = {
    beforeUpload: (file: UploadFile) => {
      const isImage = file.type?.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ cho phép tải lên file ảnh!');
      }
      return false; // Prevent automatic upload
    },
    onChange: (info: UploadChangeParam<UploadFile>) => {
      setUploadedImages(info.fileList);
    },
    fileList: uploadedImages,
    multiple: true,
    listType: 'picture-card' as const,
  };

  return (
    <>
      <Modal
        title="FitSight - Hướng dẫn"
        visible={visible}
        footer={null}
        width={600}
        bodyStyle={{ padding: 24 }}
        maskClosable
      >
        {currentStep === 0 && (
          <>
            <h2>Giới thiệu FitSight</h2>
            <p>Xin chào! Mình là FitSight, trợ lý ảo đến từ dự án FitSight – Giải pháp cá nhân hóa sức khỏe từ hình ảnh.</p>
            <p>Mình sẽ đồng hành cùng bạn trong hành trình cải thiện vóc dáng, đưa ra các gợi ý luyện tập và chế độ ăn phù hợp dựa trên hình ảnh của chính bạn.</p>
            <p>Bắt đầu nhé?</p>
          </>
        )}

        {currentStep === 1 && (
          <>
            <h2>Chọn giới tính</h2>
            <p>Trước tiên, cho mình biết bạn thuộc giới tính nào nhé?</p>
            <Radio.Group
              onChange={(e) => setGender(e.target.value)}
              value={gender}
              optionType="button"
              buttonStyle="solid"
              style={{ marginBottom: 24 }}
            >
              <Radio.Button value="Nam">Nam</Radio.Button>
              <Radio.Button value="Nữ">Nữ</Radio.Button>
            </Radio.Group>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2>Tải ảnh để đánh giá</h2>
            <p>Giờ bạn hãy gửi một bức ảnh toàn thân gần đây của mình (tốt nhất là trong tư thế đứng thẳng, rõ ràng) để mình có thể đánh giá vóc dáng hiện tại của bạn nhé.</p>
            <p>Yên tâm là hình ảnh của bạn sẽ được bảo mật tuyệt đối!</p>
            <Upload {...uploadProps}>
              {uploadedImages.length < 3 && <div style={{ color: '#34c759' }}>Tải lên ảnh</div>}
            </Upload>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2>Chọn nhóm luyện tập</h2>
            <p>Mình muốn hiểu rõ hơn mục tiêu luyện tập của bạn. Bạn thuộc nhóm nào dưới đây?</p>
            <Radio.Group
              onChange={(e) => setTrainingGroup(e.target.value)}
              value={trainingGroup}
              optionType="button"
              buttonStyle="solid"
              style={{ marginBottom: 24 }}
            >
              <Radio.Button value="Gym">Người tập Gym (có thiết bị và máy móc)</Radio.Button>
              <Radio.Button value="Workout">Người tập Workout (tập không dụng cụ)</Radio.Button>
            </Radio.Group>
          </>
        )}

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          {currentStep > 0 && (
            <Button
              style={{ marginRight: 8 }}
              onClick={prev}
            >
              Quay lại
            </Button>
          )}
          <Button
            type="primary"
            style={{ backgroundColor: '#34c759', borderColor: '#34c759' }}
            onClick={next}
          >
            {currentStep === totalSteps - 1 ? 'Hoàn thành' : 'Tiếp tục'}
          </Button>
        </div>
      </Modal>

      {finished && <Home />}
    </>
  );
};

export default FitSightSteps;
