import React from "react";
import UploadDropzone from "./UploadDropzone";
import PageContainer from "../../components/layout/PageContainer";

const Upload: React.FC = () => {
  return (
    <PageContainer>
      <UploadDropzone />
    </PageContainer>
  );
};

export default Upload;