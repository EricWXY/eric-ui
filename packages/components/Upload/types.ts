export interface UploadProps {
  action: string;
  beforeUpload?(file: File): boolean | Promise<File>;
  onChange?(file: File): void;
  onProgress?(percentage: number, file: File): void;
  onSuccess?(data: any, file: File): void;
  onError?(err: any, file: File): void;
}
