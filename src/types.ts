export interface AppState {
  // Group 1
  isPT1: boolean;

  // Group 2 - 1.5 points
  olympia: boolean;
  hsgQuocGia: boolean;
  hsgTinh: boolean;
  khktQuocGia: boolean;
  khktTinh: boolean;
  hsXuatSac: boolean;
  khoiNghiepNhatNhiBa: boolean;
  tinHocTreNhatNhiBa: boolean;
  olympic: boolean;
  theThao: boolean;
  startupDueNhatNhiBa: boolean;

  // Group 2 - 1.0 points
  hsgKkTinh: boolean;
  khktKkTinh: boolean;
  hsGioi: boolean;
  khoiNghiepKk: boolean;
  tinHocTreKk: boolean;
  startupDueKk: boolean;

  // Group 3
  tinHocQuocTe: boolean;
  sat: number;
  act: number;
  ngoaiNgu: number;
  heDaoTao: string;
}
