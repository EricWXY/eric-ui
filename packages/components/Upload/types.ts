export type UploadFileStatus = "ready" | "uploading" | "success" | "error";

export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: UploadFileStatus;
  percent?: number;
  raw?: File;
  response?: any;
  error?: any;
}

export interface UploadProps {
  action: string;
  defaultFileList?: UploadFile[];
  beforeUpload?(file: File): boolean | Promise<File>;
  onChange?(file: File): void;
  onProgress?(percentage: number, file: File): void;
  onSuccess?(data: any, file: File): void;
  onError?(err: any, file: File): void;

  onRemove?(file: UploadFile): void;
}

export interface UploadListProps {
  fileList: UploadFile[];
  onRemove?(file: UploadFile): void;
}
